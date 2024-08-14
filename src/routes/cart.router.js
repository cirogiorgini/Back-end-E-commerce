const { Router } = require('express')
const CartController = require('../controller/CartController');
const { isUser, isUserOrPremium } = require('../middlewares/rol.middleware');

const router = Router();

router.get('/carts', CartController.getCarts);
router.post('/carts', CartController.addCart);
router.post('/carts/:cid/product/:pid', isUserOrPremium , CartController.addProductToCart);
router.get('/carts/:cid', CartController.getCartById);
router.delete('/carts/:cid/product/:pid', CartController.deleteProduct);
router.put('/carts/:cid', CartController.updateCart);
router.put('/carts/:cid/product/:pid', CartController.updateProductQuantityFromCart);
router.delete('/carts/:cartId', CartController.clearCart);
router.post('/carts/:cid/purchase', isUserOrPremium , CartController.purchaseCart);

module.exports = router;