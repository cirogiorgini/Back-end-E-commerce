require('dotenv').config();

module.exports = {
    appId: process.env.APP_ID,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.CALLBACK_URL
}