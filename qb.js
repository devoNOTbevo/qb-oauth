const QuickBooks = require('node-quickbooks');
const config = require('./config.json');

class QBTools {
    constructor(){
        this.oauth = {
            discovery : config.DISCOVERY_URL,
            clientId : config.CLIENT_ID,
            clientSecret: config.CLIENT_SECRET,
            tokenURL: null,
            refreshToken: null,
            accessToken: null,
            realmId: null,
            authHeader: new Buffer(config.CLIENT_ID + ":" + config.CLIENT_SECRET).toString('base64'),
            expiration: null
        };
    }

    findCustomers(queryTerm, queryField) {
        const promise = new Promise((resolve, reject) => {
            const qbo = this.newQBO();
            qbo.findCustomers([{
                    field: 'fetchAll',
                    value: true
                },
                {
                    field: queryField,
                    value: queryTerm,
                    operator: 'LIKE'
                }
            ], (e, customers) => {
                console.log("got here into the qbo callback")
                resolve(customers);
                reject(e);
            });
    
        });
    
        return promise;
    }

    newQBO() {
        return new QuickBooks(
            this.oauth.clientId,
            this.oauth.clientSecret.CLIENT_SECRET,
            this.oauth.accessToken,
            false, /* no token secret for oAuth 2.0 */
            this.oauth.realmId,
            config.useSandbox, /* use a sandbox account */
            true, /* turn debugging on */
            4, /* minor version */
            '2.0', /* oauth version */
            this.oauth.refreshToken /* refresh token */
        )
    };
}

module.exports = new QBTools();