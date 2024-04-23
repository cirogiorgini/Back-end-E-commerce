const { Router } = require('express')
const User = require('../dao/models/user.mode')
const router = Router()



router.post('/api/sessions/login',  async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email, password })
    if (!user) {
        return res.status(400).send('Invalid email or password!')
    }

    req.session.user = { id: user._id.toString(), email: user.email }
    res.redirect('/home')
})

router.get('/api/sessions/logout', (req, res) => {
    req.session.destroy(_ => {
        res.redirect('/');
    })
})

router.post('/api/sessions/register', async  (req, res) => {
    const { firstName, lastName, email, age, password } = req.body

    try {
        await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password
        })

        res.redirect('/')
    }
    catch (err) {
        console.log(err)
        res.status(400).send('Error creating user!')
    }
})

module.exports = router