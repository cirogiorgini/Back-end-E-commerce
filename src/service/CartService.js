const CartDAO = require('../dao/CartDAO');

class CartService {
    async getCarts() {
        return await CartDAO.getCarts();
    }

    async addCart() {
        return await CartDAO.addCart();
    }

    async addProductToCart(productId, cartId) {
        productId = productId.trim();
        const product = await CartDAO.findProductById(productId);
        if (!product) {
            throw new Error('El producto no existe');
        }

        const cart = await CartDAO.findCartById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe');
        }

        const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await CartDAO.saveCart(cart);
        return cart;
    }

    async getCartById(cartId) {
        return await CartDAO.findCartById(cartId);
    }

    async deleteProductFromCart(productId, cartId) {
        const cart = await CartDAO.findCartById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe.');
        }

        const productIndex = cart.products.findIndex(p => p._id.equals(productId));
        if (productIndex === -1) {
            throw new Error('El producto no se encontró en el carrito.');
        }

        await CartDAO.updateCart(cartId, { $pull: { products: { _id: productId } } });
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
        const existingCart = await CartDAO.findCartById(cartId);
        if (!existingCart) {
            throw new Error('El carrito no existe');
        }

        await CartDAO.updateCart(cartId, { $set: { products: [] } });
    }
}

module.exports = new CartService();
