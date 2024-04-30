const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../dao/dbManager/userManager')
const { createHash, isValidPassword } = require('../utils/hasing')

const initialzeStrategy = () => {
    passport.use('register', new Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    },     async (req, username, password, done) => {

        const { firstName, lastName, age } = req.body

       try{

        const user = await User.createUser({email: username})
        if(user){
            console.log('El usuario ya existe')
            return done(null, false)
       }

       const newUser = {
           firstName,
           lastName,
           age: +age,
           email,
           password: createHash(password)
        }
        const result = await User.createUser(newUser)

        return done(null, result)
        
    }

    catch(err){
        console.log(err)
    }

    }))

    passport.serializeUser((user, done) => {
        console.log('Serializando el usuario')
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log('Deserializando el usuario')
        const user = await User.getUser(id)
        done(null, user)
    })

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await User.findOne({email: username})
            if(!user){  
                return done(null, false)
            }

            if(!isValidPassword(user, password)){
                return done(null, false)
            }

            return done(null, user)

        } catch (error) {
            done(error)
        }
    }))
}

module.exports = initialzeStrategy