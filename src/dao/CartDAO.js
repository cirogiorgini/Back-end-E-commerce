const { Carts, Products } = require('../models');

class CartDAO {
    async getCarts() {
        return Carts.find();
    }

    async addCart() {
        return Carts.create({ products: [] });
    }

    async addProductToCart(productId, cartId) {
        const product = await Products.findById(productId);
        if (!product) throw new Error('El producto no existe');

        const cart = await Carts.findById(cartId);
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

    async getCartById(cartId) {
        return Carts.findById(cartId).populate('products.product');
    }

    async deleteProductFromCart(productId, cartId) {
        const cart = await Carts.findById(cartId);
        if (!cart) throw new Error('El carrito no existe');

        const productIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (productIndex === -1) throw new Error('El producto no se encontró en el carrito');

        cart.products.splice(productIndex, 1);
        await cart.save();
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
