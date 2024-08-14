const { Router } = require('express')
const passport = require('passport')

const UserDao = require('../dao/UserDAO');
const UserController = require('../controller/UserController');
const UserService = require('../service/UserService');
const transport = require('../utils/transport')

const router = Router()


router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), async (req, res) => {
    console.log(req.body)
    
    try {
        const user = await UserDao.findUserById(req.user._id);
        if (user) {
            user.Last_conecction = new Date(); 
            await user.save();
        }
    } catch (error) {
        console.error('Error al actualizar la última conexión del usuario:', error);
    }

    req.session.user = {
        id: req.user._id,
        email: req.user.email,
        rol: req.user.rol
    }

    res.redirect('/home')
})

router.get('/sessions/faillogin', (req, res) => {
    res.send({ status: 'error', message: 'Credenciales incorrectas' })
})

router.get('/sessions/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/');
    })
})

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), (req, res) => {
    console.log(req.body)
    res.redirect('/')
})

router.get('/sessions/failregister', (req, res) => {
    res.send({ status: 'error', message: 'Se ha producido un error' })
})

router.get('/sessions/github', (req, res, next) => {
    console.log("autenticando usuario con github");
    next();
}, passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/githubcallback', (req, res, next) => {
    console.log("callback de autenticacion recibida");
    next();
}, passport.authenticate('github', { failureRedirect: '/api/sessions/faillogin' }), (req, res) => {
    req.session.user = { id: req.user._id };
    console.log("usuario autenticado:", req.session.user);
    res.redirect('/home');
});





module.exports = router