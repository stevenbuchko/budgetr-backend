import express from 'express';
import dotenv from 'dotenv';
import 'babel-polyfill';
import User from './src/controllers/User';

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

app.listen(3000);
console.log('app running on port ', 3000);
