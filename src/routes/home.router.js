const { Router } = require('express')
const CartController = require('../controller/CartController');

const router = Router()


router.get('/',  (req, res) => {
    try {
        const isLoggedIn =  ![null, undefined].includes(req.session.user)
        res.render('start', {
            title: 'start',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
            scripts: [
                'index.js'
            ],
            styles: [
                'index.css'
            ]
        })
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get('/login', (_, res) => {
    res.render('login', {
        styles: [
            'index.css'
        ],
        title: 'Login'
    });
});


router.get('/register', (_, res) => {
    res.render('register', {
        styles: [
            'styles.css'
        ],
        title: 'Register'
    });
});

router.get('/profile', async (req, res) => {
    try {
        const isLoggedIn = req.session.user !== undefined;
        console.log(isLoggedIn)

        const userId = req.session.user ? req.session.user.id : null;
        console.log('ID del usuario de la sesión:', userId);

        const UserController  = req.app.get('UserService');
        const user = isLoggedIn ? await UserController.getUserById(userId) : null;

        res.render('profile', {
            styles: ['index.css'],
            scripts: ['index.js'],
            titlePage: 'Perfil',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email,
                rol: user.rol,
                cart: user.cart
            },
            isLoggedIn
        });
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.get('/home', async (req, res) => {
    try {
        const ProductController = req.app.get("ProductController");
        const UserController = req.app.get("UserService");

        const products = await ProductController.getProducts(req.query);
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        const userId = req.session.user ? req.session.user.id : null;

        const user = isLoggedIn ? await UserController.getUserById(userId) : null;
        const cartId = user ? user.cart : null;

        res.render('home', {
            title: 'Products',
            products,
            isLoggedIn,
            cartId,
            rol: user ? user.rol : null,
            firstName: user ? user.firstName : null,
            lastName: user ? user.lastName : null,
            scripts: ['index.js'],
            styles: ['index.css']
        });
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/cart/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartController.getCartById(req, res);
        const products = cart.products.map(d => d.toObject({ virtuals: true }));

        res.render('cart', {
            title: 'Carrito',
            products,
            cartId,
            scripts: ['index.js'],
            styles: ['index.css']
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router