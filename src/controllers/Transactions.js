import moment from 'moment';
import Plaid from './Plaid';
import Wallet from './Wallet';

const Transactions = {
    async getTotalExpensesCurrentMonth(req, res) {
        let total_expenses = 0;
        let total_revenue = 0;
        let access_tokens = await Wallet.getAccessTokensByUserId(req.params.id);

        let accessTokenPromises = access_tokens.map(access_token => new Promise(resolve => {
            Plaid.getTransactionsCurrentMonthByAccessToken(access_token).then(transactions => {
                transactions.forEach(transaction => {
                    if (transaction.amount > 0) {
                        total_expenses += transaction.amount;
                    } else {
                        total_revenue += transaction.amount;
                    }
                })
                resolve();
            })
        }))

        await Promise.all(accessTokenPromises);

        console.log("total expenses: " + total_expenses);

        let total_expenses_amount = (total_expenses * -1).toFixed(2);
        let total_revenue_amount = (total_revenue * -1).toFixed(2);
        let total_expenses_formatted = "$" + (total_expenses_amount * -1).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let total_revenue_formatted = "$" + (total_revenue_amount).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

        let total_net = (total_revenue + total_expenses) * -1;

        let total_net_amount = total_net.toFixed(2);
        let total_net_formatted = '';

        if (total_net < 0) {
            total_net_formatted = "-$" + (total_net_amount * -1).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
        } else {
            total_net_formatted = "$" + (total_net_amount).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }

        res.json({
            total_expenses_amount: total_expenses_amount,
            total_expenses_formatted: total_expenses_formatted,
            total_revenue_amount: total_revenue_amount,
            total_revenue_formatted: total_revenue_formatted,
            total_net_amount: total_net_amount,
            total_net_formatted: total_net_formatted
        });
    },
    async getExpensesChartData(req, res) {
        let access_tokens = await Wallet.getAccessTokensByUserId(req.params.id);
        let expenseDataList = [];
        let incomeDataList = [];
        let expenseTransactionList = [];
        let incomeTransactionList = [];
        let total_days = moment().date();

        let accessTokenPromises = access_tokens.map(access_token => new Promise(resolve => {
            Plaid.getTransactionsCurrentMonthByAccessToken(access_token).then(transactions => {
                transactions.forEach(transaction => {
                    let transaction_date = moment(transaction.date).date();
                    if (transaction.amount > 0) {
                        expenseTransactionList.push({
                            amount: transaction.amount,
                            date: transaction_date
                        })
                    } else {
                        incomeTransactionList.push({
                            amount: transaction.amount * -1,
                            date: transaction_date
                        })
                    }
                })
                resolve();
            })
        }))

        await Promise.all(accessTokenPromises);

        for (var day = 1; day <= total_days; day++) {
            let total_expenses = 0;
            let total_income = 0;

            expenseTransactionList.forEach(transaction => {
                if (transaction.date <= day) {
                    total_expenses += transaction.amount;
                }
            })

            incomeTransactionList.forEach(transaction => {
                if (transaction.date <= day) {
                    total_income += transaction.amount;
                }
            })

            expenseDataList.push({
                x: day,
                y: Number(total_expenses.toFixed(2))
            });

            incomeDataList.push({
                x: day,
                y: Number(total_income.toFixed(2))
            });
        }

        res.json({
            expenseData: expenseDataList,
            incomeData: incomeDataList
        });
    },
    async getTransactions1Day(req, res) {
        let access_tokens = await Wallet.getAccessTokensByUserId(req.params.id);
        let transactionList = [];

        let accessTokenPromises = access_tokens.map(access_token => new Promise(resolve => {
            Plaid.getTransactions1DayByAccessToken(access_token).then(transactions => {
                transactions.forEach(transaction => {
                    let amount_formatted = ''
                    if (transaction.amount < 0) {
                        amount_formatted = "$" + (transaction.amount * -1).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    } else {
                        amount_formatted = "-$" + (transaction.amount).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    }

                    transactionList.push({
                        category: transaction.category[0],
                        name: transaction.name,
                        date: moment(transaction.date).format("M/D/YY"),
                        amount: transaction.amount,
                        amount_formatted: amount_formatted
                    });
                })
                resolve();
            });
        }));

        await Promise.all(accessTokenPromises);

        let transactionListSorted = transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            transactions: transactionListSorted
        });
    },
    async getTransactions7Day(req, res) {
        let access_tokens = await Wallet.getAccessTokensByUserId(req.params.id);
        let transactionList = [];

        let accessTokenPromises = access_tokens.map(access_token => new Promise(resolve => {
            Plaid.getTransactions7DayByAccessToken(access_token).then(transactions => {
                transactions.forEach(transaction => {
                    let amount_formatted = ''
                    if (transaction.amount < 0) {
                        amount_formatted = "$" + (transaction.amount * -1).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    } else {
                        amount_formatted = "-$" + (transaction.amount).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    }

                    transactionList.push({
                        category: transaction.category[0],
                        name: transaction.name,
                        date: moment(transaction.date).format("M/D/YY"),
                        amount: transaction.amount,
                        amount_formatted: amount_formatted
                    });
                })
                resolve();
            });
        }));

        await Promise.all(accessTokenPromises);

        let transactionListSorted = transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            transactions: transactionListSorted
        });
    },
    async getTransactions30Day(req, res) {
        let access_tokens = await Wallet.getAccessTokensByUserId(req.params.id);
        let transactionList = [];

        let accessTokenPromises = access_tokens.map(access_token => new Promise(resolve => {
            Plaid.getTransactions30DayByAccessToken(access_token).then(transactions => {
                transactions.forEach(transaction => {
                    let amount_formatted = ''
                    if (transaction.amount < 0) {
                        amount_formatted = "$" + (transaction.amount * -1).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    } else {
                        amount_formatted = "-$" + (transaction.amount).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    }

                    transactionList.push({
                        category: transaction.category[0],
                        name: transaction.name,
                        date: moment(transaction.date).format("M/D/YY"),
                        amount: transaction.amount,
                        amount_formatted: amount_formatted
                    });
                })
                resolve();
            });
        }));

        await Promise.all(accessTokenPromises);

        let transactionListSorted = transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            transactions: transactionListSorted
        });
    },
    async getTransactions3Month(req, res) {
        let access_tokens = await Wallet.getAccessTokensByUserId(req.params.id);
        let transactionList = [];

        let accessTokenPromises = access_tokens.map(access_token => new Promise(resolve => {
            Plaid.getTransactions3MonthByAccessToken(access_token).then(transactions => {
                transactions.forEach(transaction => {
                    let amount_formatted = ''
                    if (transaction.amount < 0) {
                        amount_formatted = "$" + (transaction.amount * -1).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    } else {
                        amount_formatted = "-$" + (transaction.amount).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    }

                    transactionList.push({
                        category: transaction.category[0],
                        name: transaction.name,
                        date: moment(transaction.date).format("M/D/YY"),
                        amount: transaction.amount,
                        amount_formatted: amount_formatted
                    });
                })
                resolve();
            });
        }));

        await Promise.all(accessTokenPromises);

        let transactionListSorted = transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            transactions: transactionListSorted
        });
    }
}

export default Transactions;