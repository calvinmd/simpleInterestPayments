const dueDate = 15;

const loans = {
  "1": {
    status: "ACTIVE", // "CLOSED"
    price: 9900,
    down: 1000,
    p: 8900, // principal
    i: 10, // interest
    n: 48, // terms
    dueDate: 15,
    tax: 96, // annual property tax
    fee: 15, // monthly fee
    date: "3/15/2020" // starting date: do NOT use loan start date, use down payment date
  }
};

// status: PAID, PENDING, (FAILED, SKIPPED)
// transactions should be mapped by loanId, sorted ascend by txId
// sort by date is more reliable
const transactions = [
  {
    id: 1,
    date: "3/15/2020",
    type: "DOWN_PAYMENT",
    amount: 1000.0,
    status: "PAID"
  },
  {
    id: 2,
    date: "4/3/2020",
    type: "EXTRA_PAYMENT",
    amount: 400.0,
    status: "PAID"
  },
  {
    id: 3,
    date: "4/15/2020",
    type: "REGULAR",
    amount: 248.73,
    status: "PAID"
  },
  {
    id: 4,
    date: "4/17/2020",
    type: "EXTRA_PAYMENT",
    amount: 200.0,
    status: "PAID"
  },
  {
    id: 5,
    date: "4/25/2020",
    type: "EXTRA_PAYMENT",
    amount: 200.0,
    status: "PAID"
  },
  {
    id: 6,
    date: "5/15/2020",
    type: "REGULAR",
    amount: 248.73,
    status: "PAID"
  },
  {
    id: 7,
    date: "5/23/2020",
    type: "EXTRA_PAYMENT",
    amount: 200.0,
    status: "PAID"
  },
  {
    id: 8,
    date: "5/31/2020",
    type: "EXTRA_PAYMENT",
    amount: 1000.0,
    status: "PAID"
  },
  {
    id: 9,
    date: "6/6/2020",
    type: "EXTRA_PAYMENT",
    amount: 200.0,
    status: "PAID"
  },
  {
    id: 10,
    date: "6/15/2020",
    type: "REGULAR",
    amount: 248.73,
    status: "PAID"
  },
  {
    id: 11,
    date: "6/27/2020",
    type: "EXTRA_PAYMENT",
    amount: 300.0,
    status: "PAID"
  },
  {
    id: 12,
    date: "7/15/2020",
    type: "REGULAR",
    amount: 248.73,
    status: "PAID"
  },
  {
    id: 13,
    date: "7/23/2020",
    type: "EXTRA_PAYMENT",
    amount: 200.0,
    status: "PAID"
  },
  {
    id: 14,
    date: "8/3/2020",
    type: "EXTRA_PAYMENT",
    amount: 200.0,
    status: "PAID"
  },
  {
    id: 15,
    date: "8/15/2020",
    type: "REGULAR",
    amount: 248.73,
    status: "PAID"
  },
  {
    id: 16,
    date: "8/21/2020",
    type: "EXTRA_PAYMENT",
    amount: 700.0,
    status: "PAID"
  }
];

module.exports = { dueDate, loans, transactions };
