const MongoStore = require('connect-mongo')
const session = require('express-session')
const defaultOptions = require('./defaultOptions')

const { dbName, mongoUrl } = require('../dbConfig')

const storage = MongoStore.create({
    dbName,
    mongoUrl: mongoUrl,
    ttl: 600
})

module.exports = session({
    store: storage,
    ...defaultOptions
})