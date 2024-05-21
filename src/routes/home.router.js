const { Router } = require('express')

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
            titlePage: 'Perfil',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                email: user.email,
                rol: user.rol
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
        console.log(products)

        const isLoggedIn = ![null, undefined].includes(req.session.user);
        const userId = req.session.user ? req.session.user.id : null;
        console.log('ID del usuario de la sesión:', userId);

        const user = isLoggedIn ? await UserController.getUserById(userId) : null;
        console.log('Datos del usuario obtenidos:', user);

        const rol = user ? user.rol : null;
        const firstName = user ? user.firstName : null;
        const lastName = user ? user.lastName : null;

        res.render('home', {
            title: 'Products',
            products,
            isLoggedIn,
            rol,
            firstName,
            lastName,
            scripts: ['index.js'],
            styles: ['index.css']
        });
    } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


router.get('/cart/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
    
        const CartManager = req.app.get('cartManager')
        const productToCart = await CartManager.getCartById(cartId)

        const products = productToCart.products.map(d => d.toObject({ virtuals: true }))
        console.log(productToCart)

        res.render('cart', {
            title: 'Carrito',
            products,
            scripts: [
                'index.js'
            ],
            styles: [
                'index.css'
            ]
        })
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
        throw (err)

    }

})



module.exports = router