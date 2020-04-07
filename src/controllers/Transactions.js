import Plaid from './Plaid';
import { json } from 'express';

const Transactions = {
    async getTotalExpensesCurrentMonth(req, res) {
        let transactions = [];
        let total_expenses = 0;
        transactions = await Plaid.getTransactionsCurrentMonth(req.params.id);
        console.log("respondo: " + transactions);

        transactions.forEach(transaction => {
            if (transaction.amount > 0) {
                total_expenses += transaction.amount;
            } else {

            }
        });

        console.log("total expenses: " + total_expenses);

        let total_expenses_amount = total_expenses.toFixed(2);
        let total_expenses_formated = "$" + (total_expenses_amount).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

        res.json({
            total_expenses_amount: total_expenses_amount,
            total_expenses_formated: total_expenses_formated
        });
    }
}

export default Transactions;