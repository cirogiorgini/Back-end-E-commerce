const { Router } = require('express')
const User = require('../dao/models/user.model')
const router = Router()
const {hashPassword} = require('../utils/hasing')



router.post('/api/sessions/login', async (req, res) => {
    const { email, password } = req.body;

    // Verificar si el usuario es administrador
    const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123';

    // Verificar las credenciales del usuario
    let user;
    if (isAdmin) {
        // Si el usuario es administrador, no necesitas buscar en la base de datos
        user = { _id: 'admin', email: 'adminCoder@coder.com', rol: 'admin' };
    } else {
        // Si no es administrador, busca en la base de datos
        user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).send('Invalid email or password!');
        }
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