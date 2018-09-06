const qbTools = require('./qb.js');
const auth = qbTools.oauth;
const axios = require('axios');
const qs = require('querystring');
const moment = require('moment');

const authInit = (req, res) => {
    console.log("INITIALIZING AUTH")
    const authQuery = {
        client_id: auth.clientId,
        redirect_uri: 'http://localhost:5000/callback',
        scope: 'com.intuit.quickbooks.accounting',
        response_type: 'code',
        state: 'testing'
    };

    axios.get(auth.discovery)
        .then((response) => {
            console.log(response.data)
            auth.tokenURL = response.data.token_endpoint;
            const url = response.data.authorization_endpoint + '?' + qs.stringify(authQuery);
            console.log(url);
            res.redirect(url);
        });
};

const oauthCallback = (req, res) => {
    if (req.query.state !== 'testing') console.log('STATE NOT CORRECT');
    if (!auth.tokenURL) console.log('TOKEN URL NOT SET');
    console.log("CALLING BACK WITH TOKEN URL: ", auth.tokenURL);
    auth.realmId = req.query.realmId;

    // res.redirectAfterGetToken = 

    const tokenQuery = {
        code: req.query.code,
        redirect_uri: 'http://localhost:5000/callback',
        grant_type: 'authorization_code',
    };

    getAccessToken(tokenQuery, res);
};

const getAccessToken = (tokenQuery, response) => {
    const headers = {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + auth.authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'oauth.platform.intuit.com'
    };

    axios.post(auth.tokenURL, qs.stringify(tokenQuery), { headers })
        .then(
            (res) => {
                auth.accessToken = res.data.access_token;
                auth.refreshToken = res.data.refresh_token;
                auth.expiration = moment().add(res.data.expires_in, "seconds");
                
            },
            (err) => {
                console.log("ERROR: ", err.response.status, " ", err.response.statusText);
            });
}

const checkAuth = (req, res, next) => {
    if (auth.accessToken && auth.expiration.isAfter(moment())) return next();
    res.redirect('/auth');
};

module.exports = {
    authInit,
    oauthCallback,
    checkAuth
};