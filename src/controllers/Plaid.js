import plaid from 'plaid';
import moment from 'moment';
import Wallet from './Wallet';

var PLAID_CLIENT_ID = "5e5952355eca9300160d9565";
var PLAID_SECRET = "5784c7cd84a74e8b49a26612788eeb";
var PLAID_PUBLIC_KEY = "54c75f7e9700d13893662d872beee7";
var PLAID_ENV = "sandbox";

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
        // Second, exchange the public token for an access token
        client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
            console.log(error);
            ACCESS_TOKEN = tokenResponse.access_token;
            ITEM_ID = tokenResponse.item_id;
            console.log("access: " + ACCESS_TOKEN);
            return Wallet.create(req.params.id, ACCESS_TOKEN, ITEM_ID, res);

            // res.json({
            //     access_token: ACCESS_TOKEN,
            //     item_id: ITEM_ID
            // });
            // console.log("access token below");
            // console.log(ACCESS_TOKEN);
        });
    },
    async getAccountInformation(req, res) {
        // Get user ID
        let USER_ID = [req.params.id];
        console.log("user_id:" + USER_ID);

        let ACCESS_TOKEN = await Wallet.getAccessTokenByUserId(USER_ID);

        console.log("access boy: " + ACCESS_TOKEN);

        client.getAccounts(ACCESS_TOKEN, function (error, tokenResponse) {
            console.log(error);
            console.log(tokenResponse);
            let NAME = tokenResponse.accounts[0].name;
            let MASK = tokenResponse.accounts[0].mask;
            console.log(NAME);

            res.json({
                name: NAME,
                mask: MASK
            });
        })
    }
};

export default Plaid;

// async getTransactions = (req, res) => {
//     // Pull transactions for the last 30 days
//     let startDate = moment()
//         .subtract(30, "days")
//         .format("YYYY-MM-DD");
//     let endDate = momemt().format("YYYY-MM-DD");
//     console.log("made it past variables");
//     client.getTransactions(
//         ACCESS_TOKEN,
//         startDate,
//         endDate,
//         {
//             count: 250,
//             offset: 0
//         },
//         function (error, transactionResponse) {
//             res.json({ transactions: transactionResponse });
//             // TRANSACTIONS LOGGED BELOW!
//             // They will show up in the terminal that you are running nodeman in.
//             console.log(transactionResponse);
//         }
//     )
// }