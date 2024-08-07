const passport = require('passport')
const { Strategy } = require('passport-github2')
const User = require('../models/user.model')
const { clientID, clientSecret, callbackURL } = require('./github.private')

const initializeStrategy = () => {

    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)

            const user = await User.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }

            const newUser = {
                firstName: profile._json.name,
                lastName: '',
                age: 30,
                email: profile._json.email,
                password: ''
            }
            const result = await User.create(newUser)

            if (!user.cart) {
                const newCart = await Cart.create({});
                user.cart = newCart._id;
                await user.save();
            }
            done(null, result)
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

    
}

module.exports = initializeStrategy