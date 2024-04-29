const bcrypt = require ('bcrypt')

module.exports ={
    hasPassword: value => bcrypt.hashSync(value, bcrypt.genSaltSync(10)),
}