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



router.get('/home', async (req, res) => {

    const ProductManager = req.app.get("productManager")
    const products = await ProductManager.getProducts(req.query)
    
    res.render('home', {
        title: 'Products',
        products,
        scripts: [
            'index.js'
        ],
        styles: [
            'index.css'
        ]
    })
})

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