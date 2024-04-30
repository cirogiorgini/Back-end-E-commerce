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


module.exports = router