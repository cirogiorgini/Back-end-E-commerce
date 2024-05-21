const { Router } = require('express')
const ProductController = require('../controller/ProductController');

const router = Router()

// router.get('/api/products', async (req, res) => {
//     try {
//         const products = await ProductController.getProducts(req.query);
//         res.json(products);
//     } catch (error) {
//         console.error('Error al obtener los productos:', error);
//         res.status(500).json({ message: 'Error al obtener los productos' });
//     }
// });
router.get('/products/:id', ProductController.getProductById);
router.post('/', ProductController.addProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router