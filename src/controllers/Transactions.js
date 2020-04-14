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
    }
}

export default Transactions;