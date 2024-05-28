const { Router } = require('express')
const CartController = require('../controller/CartController');

const router = Router();

router.get('/carts', CartController.getCarts);
router.post('/carts', CartController.addCart);
router.post('/carts/:cid/product/:pid', CartController.addProductToCart);
router.get('/carts/:cid', CartController.getCartById);
router.delete('/carts/:cid/product/:pid', CartController.deleteProductFromCart);
router.put('/carts/:cid', CartController.updateCart);
router.put('/carts/:cid/product/:pid', CartController.updateProductQuantityFromCart);
router.delete('/carts/:cartId', CartController.clearCart);

module.exports = router;