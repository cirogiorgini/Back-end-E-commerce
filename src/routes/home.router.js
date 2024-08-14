const { Router } = require('express')
const CartController = require('../controller/CartController');
const UserService = require('../service/UserService');
const ProductService = require('../service/ProductService');
const { isAdmin, isNotAUser } = require('../middlewares/rol.middleware');
const ProductController = require('../controller/ProductController');

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

        const UserService  = req.app.get('UserService');
        const user = isLoggedIn ? await UserService.getUserById(userId) : null;

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
        const products = await ProductService.getAllProducts();
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        const userId = req.session.user ? req.session.user.id : null;

        const user = isLoggedIn ? await UserService.getUserById(userId) : null;
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


router.get('/api/users/adminDashboard', isAdmin, async (req, res) =>{
    try {
        const users = await UserService.getAllUsers(req.body);

        const usersList = users.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            rol: user.rol
        }));


        res.render ('userDashboard',{
            title: 'UserDashboard',
            usersList,
            scripts: ['index.js'],
            styles: ['index.css']
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/api/products/productsDashboard', isAdmin, async (req, res) =>{
    try {
        const products = await ProductService.getAllProducts();



        res.render ('productsDashboard',{
            title: 'ProductsDashboard',
            products,
            scripts: ['index.js'],
            styles: ['index.css']
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/createProduct', isNotAUser ,(req, res) => {
    res.render('createProduct', {
        title: 'Crear producto',
        styles: ['index.css'],
        scripts: ['index.js']
    });
});


module.exports = router