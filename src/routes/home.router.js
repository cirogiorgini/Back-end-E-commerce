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

        const userManager = req.app.get('userManager');
        const user = await userManager.getUser(userId);

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
        const ProductManager = req.app.get("productManager");
        const products = await ProductManager.getProducts(req.query);

        // Verificar si el usuario está autenticado
        const isLoggedIn = ![null, undefined].includes(req.session.user);

        // Obtener el id de la sesión del usuario
        const userId = req.session.user ? req.session.user.id : null;
        console.log('ID del usuario de la sesión:', userId);


        // Obtener los datos del usuario utilizando el UserManager
        const userManager = req.app.get('userManager');
        const user = await userManager.getUser(userId);

        // Extraer los datos del usuario
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