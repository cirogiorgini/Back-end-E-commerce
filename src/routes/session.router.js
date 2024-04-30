const { Router } = require('express')
const passport = require('passport')

const router = Router()


router.post('/api/sessions/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), (req, res) => {
    console.log(req.body)
    req.session.user = {
        id: req.user._id,
        email: req.user.email
    }

    res.redirect('/home')
})

router.get('/api/sessions/faillogin', (req, res) => {
    res.send({ status: 'error', message: 'Credenciales incorrectas' })
})

router.get('/api/sessions/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/');
    })
})

router.post('/api/sessions/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), (req, res) => {
    console.log(req.body)
    res.redirect('/')
})

router.get('/api/sessions/failregister', (req, res) => {
    res.send({ status: 'error', message: 'Se ha producido un error' })
})

router.get('/api/sessions/github', (req, res, next) => {
    console.log("autenticando usuario con github");
    next();
}, passport.authenticate('github', { scope: ['user:email'] }));

router.get('/api/sessions/githubcallback', (req, res, next) => {
    console.log("callback de autenticacion recibida");
    next();
}, passport.authenticate('github', { failureRedirect: '/api/sessions/faillogin' }), (req, res) => {
    req.session.user = { id: req.user._id };
    console.log("usuario autenticado:", req.session.user);
    res.redirect('/home');
});



module.exports = router