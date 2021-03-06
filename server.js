import express from 'express';
import dotenv from 'dotenv';
import 'babel-polyfill';
import User from './src/controllers/User';
import Plaid from './src/controllers/Plaid';
import Transactions from './src/controllers/Transactions';

dotenv.config();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
})

app.post('/api/v1/users', User.create);
app.get('/api/v1/users', User.getAll);
app.get('/api/v1/users/:id', User.getOne);
app.put('/api/v1/users/:id', User.update);
app.delete('/api/v1/users/:id', User.delete);
app.post('/api/v1/plaid/:id', Plaid.receivePublicToken);
app.get('/api/v1/plaid/:id', Plaid.getAccountInformation);
app.get('/api/v1/transactions1day/:id', Transactions.getTransactions1Day);
app.get('/api/v1/transactions7days/:id', Transactions.getTransactions7Day);
app.get('/api/v1/transactions30days/:id', Transactions.getTransactions30Day);
app.get('/api/v1/transactions3months/:id', Transactions.getTransactions3Month);
app.get('/api/v1/categories', Plaid.getCategories);
app.delete('/api/v1/plaid/:id', Plaid.removeItem);
app.post('/api/v1/transactions/:id', Transactions.getTotalExpensesCurrentMonth);
app.get('/api/v1/transactions/expenseData/:id', Transactions.getExpensesChartData);

app.listen(3000);
console.log('app running on port ', 3000);
