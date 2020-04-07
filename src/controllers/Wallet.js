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
    async create(user_id, access_token, item_id, account_id, res) {
        const text = `INSERT INTO
        wallets(item_id, access_token, user_id, account_id)
        VALUES($1, $2, $3, $4)
        returning *`;
        const values = [
            item_id,
            access_token,
            user_id,
            account_id
        ];
        console.log("made it in wallet.create");
        try {
            const { rows } = await db.query(text, values);
            return res.status(201).send(rows[0]);
        } catch (error) {
            return res.status(400).send(error);
        }
    },

    async getAccessTokenByUserId(user_id) {
        console.log(user_id);
        const text = 'SELECT access_token FROM wallets WHERE user_id = \'' + user_id + '\'';
        console.log(text);
        try {
            const { rows } = await db.query(text);
            console.log("rows: " + JSON.stringify(rows));
            const ACCESS_TOKEN = rows[0].access_token;
            console.log("my access: " + ACCESS_TOKEN);
            return ACCESS_TOKEN;
        } catch (error) {
            console.log(error);
        }
    },

    async getAccountIdByAccessToken(access_token) {
        const text = 'SELECT account_id FROM wallets WHERE access_token = \'' + access_token + '\'';
        try {
            const { rows } = await db.query(text);
            const ACCOUNT_ID = rows[0].account_id;
            return ACCOUNT_ID;
        } catch (error) {
            console.log(error);
        }
    }

    //     /**
    //  * Get A User
    //  * @param {object} req 
    //  * @param {object} res
    //  * @returns {object} user object
    //  */
    // async getOne(req, res) {
    //     const text = 'SELECT * FROM users WHERE id = $1';
    //     try {
    //         const { rows } = await db.query(text, [req.params.id]);
    //         if (!rows[0]) {
    //             return res.status(404).send({ 'message': 'user not found' });
    //         }
    //         return res.status(200).send(rows[0]);
    //     } catch (error) {
    //         return res.status(400).send(error)
    //     }
    // },
}

export default Wallet;