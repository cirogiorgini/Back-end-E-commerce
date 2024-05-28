const { Carts, Products } = require('../models');
const Cart = require('../models/cart.model'); 
const Product = require('../models/product.model'); 

class CartDAO {
    async getCarts() {
        return Carts.find();
    }

    async addCart() {
        return Carts.create({ products: [] });
    }

    async getCartById(cartId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async addProductToCart(productId, cartId) {
        const product = await Product.findById(productId);
        if (!product) throw new Error('El producto no existe');

        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('El carrito no existe');

        const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        return cart;
    }

    async updateCart(cartId, products) {
        const cart = await Carts.findById(cartId);
        if (!cart) throw new Error('El carrito no existe');

        cart.products = products;
        await cart.save();
        return cart;
    }

    async updateProductQuantityFromCart(productId, cartId, quantity) {
        const cart = await Carts.findById(cartId);
        if (!cart) throw new Error('El carrito no existe');

        const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;
            await cart.save();
            return cart;
        } else {
            throw new Error('No se pudo encontrar el producto en el carrito');
        }
    }

    async clearCart(cartId) {
        const cart = await Carts.findById(cartId);
        if (!cart) throw new Error('El carrito no existe');

        cart.products = [];
        await cart.save();
    }
}

module.exports = new CartDAO();
