import plaid from 'plaid';
import moment from 'moment';
import Wallet from './Wallet';

var PLAID_CLIENT_ID = "5e5952355eca9300160d9565";
var PLAID_SECRET = "303aaf825c1d66a9fa10b16802f4e3";
var PLAID_PUBLIC_KEY = "54c75f7e9700d13893662d872beee7";
var PLAID_ENV = "development";

var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

// Initialize the Plaid client
const client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV],
    { version: "2019-05-29", clientApp: "Plaid Quickstart" }
);

const Plaid = {

    async receivePublicToken(req, res) {
        // First, receive the public token and set it to a variable
        let PUBLIC_TOKEN = req.body.public_token;
        let ACCOUNT_ID = req.body.account_id
        console.log('public token: ' + PUBLIC_TOKEN);
        console.log(req.body);
        // Second, exchange the public token for an access token
        client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
            console.log(error);
            console.log(tokenResponse);
            ACCESS_TOKEN = tokenResponse.access_token;
            ITEM_ID = tokenResponse.item_id;
            console.log("access: " + ACCESS_TOKEN);
            return Wallet.create(req.params.id, ACCESS_TOKEN, ITEM_ID, ACCOUNT_ID, res);
        });
    },
    async removeItem(req, res) {
        client.removeItem(req.params.id, function (error, tokenResponse) {
            console.log(error);
            res.json({ tokenResponse });
        });
    },
    async getAccountInformation(req, res) {
        // Get user ID
        let USER_ID = [req.params.id];
        console.log("user_id:" + USER_ID);

        let ACCESS_TOKEN = await Wallet.getAccessTokenByUserId(USER_ID);
        let ACCOUNT_ID = await Wallet.getAccountIdByAccessToken(ACCESS_TOKEN);

        console.log("access boy: " + ACCESS_TOKEN);

        client.getAccounts(ACCESS_TOKEN, function (error, tokenResponse) {
            console.log(error);
            console.log(tokenResponse);

            tokenResponse.accounts.forEach(account => {
                if (account.account_id == ACCOUNT_ID) {
                    let NAME = account.name;
                    let MASK = account.mask;
                    res.json({
                        name: NAME,
                        mask: MASK
                    });
                } else {

                }
            });
        })
    },
    async getTransactions30(req, res) {
        let USER_ID = [req.params.id];
        // Pull transactions for the last 30 days
        let startDate = moment()
            .subtract(30, "days")
            .format("YYYY-MM-DD");
        let endDate = moment().format("YYYY-MM-DD");
        console.log("made it past variables");
        let ACCESS_TOKEN = await Wallet.getAccessTokenByUserId(USER_ID);
        let ACCOUNT_ID = await Wallet.getAccountIdByAccessToken(ACCESS_TOKEN);
        client.getTransactions(
            ACCESS_TOKEN,
            startDate,
            endDate,
            {
                account_ids: [ACCOUNT_ID]
            },
            function (error, transactionResponse) {
                res.json({
                    transactions: transactionResponse
                });
                console.log(transactionResponse);
            }
        )
    },
    async getTransactionsCurrentMonth(user_id) {
        let USER_ID = user_id;
        // Pull transactions for the current month
        let currentDate = moment();
        let currentMonth = currentDate.format("MM");
        let currentYear = currentDate.format("YYYY")

        let startDate = currentYear + "-" + currentMonth + "-01";
        console.log(startDate);
        let endDate = moment().format("YYYY-MM-DD");
        console.log("made it past variables");
        let ACCESS_TOKEN = await Wallet.getAccessTokenByUserId(USER_ID);
        let ACCOUNT_ID = await Wallet.getAccountIdByAccessToken(ACCESS_TOKEN);

        let transactionResolver = () => { }
        let transactionPromise = new Promise(r => {
            transactionResolver = r
        })
        client.getTransactions(
            ACCESS_TOKEN,
            startDate,
            endDate,
            {
                account_ids: [ACCOUNT_ID]
            },
            function (error, transactionResponse) {
                console.log("error: " + error);
                console.log(transactionResponse.transactions);
                transactionResolver(transactionResponse.transactions)
            }
        )
        return transactionPromise
    },
    async getTransactionsCurrentYear(req, res) {
        let USER_ID = [req.params.id];
        // Pull transactions for the current month
        let currentDate = moment();
        let currentYear = currentDate.format("YYYY")

        let startDate = currentYear + "-01-01";
        console.log(startDate);
        let endDate = moment().format("YYYY-MM-DD");
        console.log("made it past variables");
        let ACCESS_TOKEN = await Wallet.getAccessTokenByUserId(USER_ID);
        let ACCOUNT_ID = await Wallet.getAccountIdByAccessToken(ACCESS_TOKEN);
        client.getTransactions(
            ACCESS_TOKEN,
            startDate,
            endDate,
            {
                account_ids: [ACCOUNT_ID]
            },
            function (error, transactionResponse) {
                res.json({
                    transactions: transactionResponse
                });
                console.log(transactionResponse);
            }
        )
    },
    async getCategories(req, res) {
        client.getCategories(function (error, transactionResponse) {
            res.json({ transactionResponse });
        })
    }
};

export default Plaid;