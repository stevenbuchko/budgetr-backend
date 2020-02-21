import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Budget = {
    /**
     * Create A Budget
     * @param {object} req 
     * @param {object} res
     * @returns {object} budget object 
     */
    async create(req, res) {
        const text = `INSERT INTO
      budgets(id, top, expenses, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
        const values = [
            uuidv4(),
            req.body.top,
            req.body.expenses,
            moment(new Date()),
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
     * Get All Budgets
     * @param {object} req 
     * @param {object} res 
     * @returns {object} budgets array
     */
    async getAll(req, res) {
        const findAllQuery = 'SELECT * FROM budgets';
        try {
            const { rows, rowCount } = await db.query(findAllQuery);
            return res.status(200).send({ rows, rowCount });
        } catch (error) {
            return res.status(400).send(error);
        }
    },
    /**
     * Get A Budget
     * @param {object} req 
     * @param {object} res
     * @returns {object} budget object
     */
    async getOne(req, res) {
        const text = 'SELECT * FROM budgets WHERE id = $1';
        try {
            const { rows } = await db.query(text, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'budget not found' });
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
     * @returns {object} updated budget
     */
    async update(req, res) {
        const findOneQuery = 'SELECT * FROM budgets WHERE id=$1';
        const updateOneQuery = `UPDATE budgets
      SET top=$1,expenses=$2,modified_date=$3
      WHERE id=$4 returning *`;
        try {
            const { rows } = await db.query(findOneQuery, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'budget not found' });
            }
            const values = [
                req.body.top || rows[0].top,
                req.body.expenses || rows[0].expenses,
                moment(new Date()),
                req.params.id
            ];
            const response = await db.query(updateOneQuery, values);
            return res.status(200).send(response.rows[0]);
        } catch (err) {
            return res.status(400).send(err);
        }
    },
    /**
     * Delete A Budget
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return statuc code 204 
     */
    async delete(req, res) {
        const deleteQuery = 'DELETE FROM budgets WHERE id=$1 returning *';
        try {
            const { rows } = await db.query(deleteQuery, [req.params.id]);
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'budget not found' });
            }
            return res.status(204).send({ 'message': 'deleted' });
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export default Budget;