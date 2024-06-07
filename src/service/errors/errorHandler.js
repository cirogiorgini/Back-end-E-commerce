/**
 * @type {import('express').ErrorRequestHandler}
 */

const { ErrorCodes } = require('./errorCodes')

const errorHandler = (error, req, res, next) => {
    console.log(error.cause)

    switch(error.code) {
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({status: 'error', message: error.name, cause: error.cause});
            break
        default:
            res.status(500).send({status: 'error', error:'Error desconocido'});
    }

    next()
}

module.exports = { errorHandler }