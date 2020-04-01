import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Wallet = {
    /**
     * Create A Wallet
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object 
     */
    async create(user_id, access_token, item_id, res) {
        const text = `INSERT INTO
        wallets(item_id, access_token, user_id)
        VALUES($1, $2, $3)
        returning *`;
        const values = [
            item_id,
            access_token,
            user_id
        ];
        console.log("made it in wallet.create");
        try {
            const { rows } = await db.query(text, values);
            return res.status(201).send(rows[0]);
        } catch (error) {
            return res.status(400).send(error);
        }
    },
}

export default Wallet;