const { Router } = require('express')
const { generateProduct } = require('../mocks/generateProducts')
const transport = require('../utils/transport')
const router = Router()

router.get('/mockingproducts', (req, res) => {
    const products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct())
    }
    res.json(products)
})

router.get('/gmailTest', async  (req,res) =>{
    await transport.sendMail({
        from: 'Ciro',
        to: 'giorginiciro@gmail.com',
        html: `
        <div>
        hola mundo!
        </div>
        `,
        subject: 'Mail de prueba',
    })

    res.send('Mail enviado!')
}) 

module.exports = router