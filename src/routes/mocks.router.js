const { Router } = require('express')
const { generateProduct } = require('../mocks/generateProducts')
const router = Router()

router.get('/mockingproducts', (req, res) => {
    const products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct())
    }
    res.json(products)
})

module.exports = router