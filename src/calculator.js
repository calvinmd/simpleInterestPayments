/**
 *  Current implementation does not take into account of missing payment
 */
const _ = require("lodash");
const moment = require("moment");

const data = require("./data");
const { transactions } = data;

// show - or 0 or 0.00, put it in one place
const ZERO = "-";

const getRegularPayment = (loan = {}) => {
  const { p, i, n, tax, fee } = loan;
  // Simple interest rate calculation
  const mi = i / 12 / 100; // monthly interest rate
  // Formula: M=(P*(im*(1+mi)^n))/(((1+mi)^n)-1)
  const principalAndInterest = (
    (p * (mi * Math.pow(1 + mi, n))) /
    (Math.pow(1 + mi, n) - 1)
  ).toFixed(2);
  const taxAmount = (tax / 12.0).toFixed(2);
  const feeAmount = fee.toFixed(2);
  const totalPayment = (
    +principalAndInterest +
    +taxAmount +
    +feeAmount
  ).toFixed(2);
  return {
    feeAmount,
    totalPayment,
    principalAndInterest,
    taxAmount
  };
};

const getMonth = (d) => moment(new Date(d)).format("M");

// TODO: ignoring the "status" field right now, or only process "PAID" tx
const getTransactions = ({ transactions = [], loan = {} }) => {
  const { p, i, tax, fee, down, date } = loan;
  const taxAmount = (+tax / 12).toFixed(2);
  const feeAmount = (+fee).toFixed(2);
  const downAmount = (+down).toFixed(2);
  // Interest is calculated based on the month end balance
  let monthEndBalance = p;
  let month = getMonth(date); // month in number
  let balance = p;
  // compact removes all falsey values from array
  return _.compact(
    transactions.map((tx) => {
      const { date, type, amount } = tx;
      if (+amount <= 0) return null;
      const currentMonth = getMonth(date);
      const amountDisplay = (+amount).toFixed(2);
      if (type === "DOWN_PAYMENT") {
        return {
          date,
          type,
          principalAndInterest: downAmount,
          principal: downAmount,
          interest: ZERO,
          balance: (+p).toFixed(2),
          tax: ZERO,
          fee: ZERO,
          totalPayment: downAmount
        };
      }
      if (type === "EXTRA_PAYMENT") {
        balance = (+balance - +amount).toFixed(2);
        if (month === currentMonth) {
          monthEndBalance = +balance;
        }
        return {
          date,
          type,
          principalAndInterest: amountDisplay,
          principal: (+amount).toFixed(2),
          interest: ZERO,
          balance,
          tax: ZERO,
          fee: ZERO,
          totalPayment: amountDisplay
        };
      }
      if (type === "REGULAR") {
        const principalAndInterest = (
          +amount -
          +taxAmount -
          +feeAmount
        ).toFixed(2);
        const mi = i / 12 / 100;
        const interest = (+monthEndBalance * mi).toFixed(2);
        const principal = (+principalAndInterest - +interest).toFixed(2);
        balance = (+balance - +principal).toFixed(2);
        // New regular payment, let's update month & balances
        month = currentMonth;
        monthEndBalance = +balance;
        return {
          date,
          type,
          principalAndInterest,
          principal,
          interest,
          balance,
          tax: taxAmount,
          fee: feeAmount,
          totalPayment: amountDisplay
        };
      }
      // Unknown payment type
      console.error("Unknown payment type: ", type);
      return null;
    })
  );
};

// Always set the day of the month to 18, moment uses "date" instead of "day"
const getNextPaymentDate = (d, dueDate) =>
  moment(new Date(d)).add(1, "month").set("date", dueDate).format("L");

const getRemainingPayments = ({
  currentBalance,
  loan = {},
  monthlyPayment = {},
  transactions = []
}) => {
  const {
    feeAmount,
    totalPayment,
    principalAndInterest,
    taxAmount
  } = monthlyPayment;
  const { dueDate, i } = loan;
  const mi = i / 12 / 100;
  // find last regular payment date
  const lastTx = _.last(transactions.filter((tx) => tx.type === "REGULAR"));
  const lastTxDate = _.get(lastTx, "date") || _.get(loan, "date");

  const type = "REGULAR"; // use Constant
  const remaining = [];
  let nextPaymentDate = getNextPaymentDate(lastTxDate, dueDate);
  let balance = +currentBalance;
  while (+balance > 0) {
    const interest = (balance * mi).toFixed(2);
    const principal = (+principalAndInterest - +interest).toFixed(2);
    if (+balance - +principal > 0) {
      balance = (+balance - +principal).toFixed(2);
      remaining.push({
        date: nextPaymentDate,
        type,
        principalAndInterest,
        principal,
        interest,
        balance,
        tax: taxAmount,
        fee: feeAmount,
        totalPayment
      });
      nextPaymentDate = getNextPaymentDate(nextPaymentDate, dueDate);
    } else {
      // TODO: last payment!
      remaining.push({
        date: nextPaymentDate,
        type,
        principalAndInterest: (+interest + +balance).toFixed(2),
        principal: (+balance).toFixed(2),
        interest,
        balance: ZERO,
        tax: taxAmount,
        fee: feeAmount,
        totalPayment: (+balance + +interest + +taxAmount + +feeAmount).toFixed(
          2
        )
      });
      break;
    }
  }
  return _.compact(remaining);
};

const calculator = (loan = {}) => {
  if (!loan) return {};
  // const { price, down, p, i, n, tax, fee, date } = loan;
  const monthlyPayment = getRegularPayment(loan);
  /**
   * Assume already retrieved transactions by id, simplified here
   * Columns:
   * Date, Payment Type, Principal+Interest, Principal, Interest, Balance, Tax, Fee, Total Payment Received
   */
  const txHistory = getTransactions({ transactions, loan });
  const currentBalance = _.get(_.last(txHistory), "balance");
  const upcomingPayments = getRemainingPayments({
    currentBalance,
    loan,
    monthlyPayment,
    transactions
  });
  return {
    monthlyPayment,
    txHistory,
    upcomingPayments
  };
};

module.exports = calculator;
