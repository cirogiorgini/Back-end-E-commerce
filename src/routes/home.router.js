const { Router } = require('express')
const router = Router()


router.get('/home', async (req, res) => {

    const ProductManager = req.app.get("productManager")
    const products = await ProductManager.getProducts(req.query)
    
    res.render('home', {
        title: 'Products',
        products,
        styles: [
            'index.css'
        ]
    })
})



module.exports = router