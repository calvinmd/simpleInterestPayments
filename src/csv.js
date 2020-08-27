const { values, flatten } = require("lodash");
const calculator = require("./calculator");

const getCsv = (loan = {}) => {
  const details = calculator(loan);
  const { txHistory, upcomingPayments } = details;

  const header = [
    "Date",
    "Type",
    "Principal and Interest",
    "Principal",
    "Interest",
    "Balance",
    "Property Tax",
    "Fee",
    "Total Payment"
  ].join(",");

  const csv = [header];
  csv.push(txHistory.map((tx) => values(tx).join(",")));
  csv.push(upcomingPayments.map((tx) => values(tx).join(",")));
  return flatten(csv).join("\n");
};

module.exports = getCsv;
