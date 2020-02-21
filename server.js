import express from 'express';
import dotenv from 'dotenv';
import 'babel-polyfill';
import Budget from './src/controllers/Budget';

dotenv.config();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
})

app.post('/api/v1/budgets', Budget.create);
app.get('/api/v1/budgets', Budget.getAll);
app.get('/api/v1/budgets/:id', Budget.getOne);
app.put('/api/v1/budgets/:id', Budget.update);
app.delete('/api/v1/budgets/:id', Budget.delete);

app.listen(3000);
console.log('app running on port ', 3000);
