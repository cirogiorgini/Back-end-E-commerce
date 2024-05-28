const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../models/user.model');
const Cart = require('../models/cart.model');  
const { isValidPassword, hashPassword } = require('../utils/hasing');

const initializeStrategy = () => {
    passport.use('register', new Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { firstName, lastName, age, email } = req.body;

        try {
            const user = await User.findOne({ email: username });
            if (user) {
                console.log('User already exists!');
                return done(null, false);
            }

            const newUser = {
                firstName,
                lastName,
                age: +age,
                email,
                password: hashPassword(password)
            };
            const result = await User.create(newUser);

            req.session.user = { email, _id: result._id.toString() };

            const newCart = await Cart.create({});
            result.cart = newCart._id;
            await result.save();

            return done(null, result);
        } catch (err) {
            done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        console.log('serialized!', user);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log('deserialized!', id);
        const user = await User.findById(id);
        done(null, user);
    });

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
            if (!user) {
                console.log('User not found!');
                return done(null, false);
            }

            if (!isValidPassword(password, user.password)) {
                return done(null, false);
            }

            if (!user.cart) {
                const newCart = await Cart.create({});
                user.cart = newCart._id;
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            done(err);
        }
    }));
};

module.exports = initializeStrategy;
