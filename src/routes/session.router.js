const { Router } = require('express')
const User = require('../dao/models/user.model')
const router = Router()
const {hashPassword, isValidPassword} = require('../utils/hasing')



router.post('/api/sessions/login', async (req, res) => {
    const { email, password } = req.body;

    
    const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123';

    
    let user;
    if (isAdmin) {
        user = { _id: 'admin', email: 'adminCoder@coder.com', rol: 'admin' };
    } else {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password!');
        }
    }

    if (!isValidPassword(password, user.password)) {
        return res.status(400).send('Invalid  password!');
    }

    // Establecer la sesión del usuario
    req.session.user = { id: user._id.toString(), email: user.email, rol: user.rol };

    // Redirigir al home
    res.redirect('/home');
});


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
            password: hashPassword(password)
        })

        res.redirect('/')
    }
    catch (err) {
        console.log(err)
        res.status(400).send('Error creating user!')
    }
})

module.exports = router