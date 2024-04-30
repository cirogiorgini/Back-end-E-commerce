const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../dao/models/user.model')
const { createHash, isValidPassword, hashedPassword } = require('../utils/hasing')

const initializeStrategy = () => {

    passport.use('register', new Strategy({
        passReqToCallback: true, 
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { firstName, lastName, age, email } = req.body

        try {
            const user = await User.findOne({ email: username })
            if (user) {
                console.log('User already exists!')
                return done(null, false)
            }

            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password: createHash(password)
            }
            const result = await User.create(newUser)

            req.session.user = {email, _id: result._id.toString()}

            // registro exitoso
            return done(null, result)
        }
        catch (err) {
            done(err)
        }

    }))

    passport.serializeUser((user, done) => {
        console.log('serialized!', user)
        done(null, user._id)
    })

 
    passport.deserializeUser(async (id, done) => {
        console.log('deserialized!', id)
        const user = await User.findById(id)
        done(null, user)
    })

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username })
            if (!user) {
                console.log('User not found!')
                return done(null, false)
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false)
            }

            return done(null, user)
        }
        catch (err) {
            done(err)
        }
    }))
    
}

module.exports = initializeStrategy