import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const User = {
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object 
     */
    async create(req, res) {
        const text = `INSERT INTO
        users(id, budget_amount, budget_amount_value, total_expenses, total_expenses_value, created_date)
        VALUES($1, $2, $3, $4, $5, $6)
        returning *`;
        const values = [
            uuidv4(),
            req.body.budget_amount,
            req.body.budget_amount,
            req.body.total_expenses,
            req.body.total_expenses,
            moment(new Date())
        ];

        try {
            const { rows } = await db.query(text, values);
            return res.status(201).send(rows[0]);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    /**
     * Get All Users
     * @param {object} req 
     * @param {object} res 
     * @returns {object} users array
     */
    async getAll(req, res) {
        const findAllQuery = 'SELECT * FROM users';
        try {
            const { rows, rowCount } = await db.query(findAllQuery);
            return res.status(200).send({ rows, rowCount });
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    /**
     * Get A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object
     */
    async getOne(req, res) {
        const text = 'SELECT * FROM users WHERE id = $1';
        try {
            const { rows } = await db.query(text, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'user not found' });
            }
            return res.status(200).send(rows[0]);
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    /**
     * Update A Budget
     * @param {object} req 
     * @param {object} res 
     * @returns {object} updated user
     */
    async update(req, res) {
        const findOneQuery = 'SELECT * FROM users WHERE id=$1';
        const updateOneQuery = `UPDATE users
      SET budget_amount=$1, budget_amount_value=$2, total_expenses=$3, total_expenses_value=$4
      WHERE id=$5 returning *`;
        try {
            const { rows } = await db.query(findOneQuery, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'user not found' });
            }
            const values = [
                req.body.budget_amount || rows[0].budget_amount,
                req.body.budget_amount || rows[0].budget_amount_value,
                req.body.total_expenses || rows[0].total_expenses,
                req.body.total_expenses || rows[0].total_expenses_value,
                req.params.id
            ];
            const response = await db.query(updateOneQuery, values);
            return res.status(200).send(response.rows[0]);
        } catch (err) {
            return res.status(400).send(err);
        }
    },
    /**
     * Delete A User
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return statuc code 204 
     */
    async delete(req, res) {
        const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
        try {
            const { rows } = await db.query(deleteQuery, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'user not found' });
            }
            return res.status(204).send({ 'message': 'deleted' });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export default User;