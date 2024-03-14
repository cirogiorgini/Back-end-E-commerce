const { Router } = require('express')

const router = Router()
const data = require('../products.json');

router.get(`/home`, (_, res) => {
    
    const product = {
        products: data,
        styles:['index.css'],
        scripts: ['index.js'],
        useWS: true,
    }

    res.render('home', product)
})



module.exports = router