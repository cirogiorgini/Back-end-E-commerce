const { Router } = require('express')
const ProductController = require('../controller/ProductController');
const { isNotAUser, isAdmin } = require('../middlewares/rol.middleware');

const router = Router()

router.get('/products', ProductController.getProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', isNotAUser, ProductController.addProduct);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', isAdmin , ProductController.deleteProduct);

module.exports = router