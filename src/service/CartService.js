const CartDAO = require('../dao/CartDAO');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

class CartService {
    async getCarts() {
        return await CartDAO.getCarts();
    }

    async addCart() {
        return await CartDAO.addCart();
    }

    async addProductToCart(productId, cartId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('El producto no existe');
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe');
            }

            const updatedCart = await CartDAO.addProductToCart(productId, cartId);
            return updatedCart;
        } catch (error) {
            console.error('Error en CartService.addProductToCart:', error);
            throw error;
        }
    }


    async getCartById(cartId) {
        return CartDAO.getCartById(cartId);
    }

    async deleteProductFromCart(productId, cartId) {
        return CartDAO.deleteProductFromCart(productId, cartId);
    }

    async updateCart(cartId, products) {
        const cart = await CartDAO.findCartById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe.');
        }

        for (const { product: productId, quantity } of products) {
            const product = await CartDAO.findProductById(productId);
            if (!product) {
                throw new Error(`El producto con ID ${productId} no existe.`);
            }

            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
        }

        await CartDAO.saveCart(cart);
    }

    async updateProductQuantityFromCart(productId, cartId, quantity) {
        const cart = await CartDAO.findCartById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe.');
        }

        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;
            await CartDAO.saveCart(cart);
        } else {
            throw new Error('No se pudo encontrar el producto en el carrito');
        }
    }

    async clearCart(cartId) {
        const existingCart = await CartDAO.getCartById(cartId);
        if (!existingCart) {
            throw new Error('El carrito no existe');
        }

        await CartDAO.updateCart(cartId, { $set: { products: [] } });
    }
}

module.exports = new CartService();
