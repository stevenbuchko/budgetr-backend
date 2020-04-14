import moment from 'moment';
import Plaid from './Plaid';
import Wallet from './Wallet';

const Transactions = {
    async getTotalExpensesCurrentMonth(req, res) {
        let total_expenses = 0;
        let access_tokens = await Wallet.getAccessTokensByUserId(req.params.id);

        let accessTokenPromises = access_tokens.map(access_token => new Promise(resolve => {
            console.log('access tokeny: ' + access_token);
            Plaid.getTransactionsCurrentMonthByAccessToken(access_token).then(transactions => {
                console.log('transaction in stuff: ' + JSON.stringify(transactions));
                transactions.forEach(transaction => {
                    if (transaction.amount > 0) {
                        total_expenses += transaction.amount;
                    } else {

                    }
                })
                resolve();
            })
        }))

        await Promise.all(accessTokenPromises);

        console.log("total expenses: " + total_expenses);

        let total_expenses_amount = total_expenses.toFixed(2);
        let total_expenses_formatted = "$" + (total_expenses_amount).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

        res.json({
            total_expenses_amount: total_expenses_amount,
            total_expenses_formatted: total_expenses_formatted
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

        res.json({
            transactions: transactionList
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

        res.json({
            transactions: transactionList
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

        res.json({
            transactions: transactionList
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

        res.json({
            transactions: transactionList
        });
    }
}

export default Transactions;