const CartService = require('../service/CartService');

class CartController {
    async getCarts(req, res) {
        try {
            const carts = await CartService.getCarts();
            res.json(carts);
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            res.status(500).json({ message: 'Error al obtener los carritos' });
        }
    }

    async addCart(req, res) {
        try {
            const newCart = await CartService.addCart();
            res.json(newCart);
        } catch (error) {
            console.error('Error al agregar un nuevo carrito:', error);
            res.status(500).json({ message: 'Error al agregar un nuevo carrito' });
        }
    }

    async addProductToCart(req, res) {
        try {
            const { productId, cartId } = req.body;
            const updatedCart = await CartService.addProductToCart(productId, cartId);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            res.status(500).json({ message: 'Error al agregar un producto al carrito' });
        }
    }

    async getCartById(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await CartService.getCartById(cartId);
            res.json(cart);
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).json({ message: 'Error al obtener el carrito' });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { productId, cartId } = req.body;
            await CartService.deleteProductFromCart(productId, cartId);
            res.json({ message: 'Producto eliminado del carrito' });
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
        }
    }

    async updateCart(req, res) {
        try {
            const { cartId, products } = req.body;
            await CartService.updateCart(cartId, products);
            res.json({ message: 'Carrito actualizado' });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            res.status(500).json({ message: 'Error al actualizar el carrito' });
        }
    }

    async updateProductQuantityFromCart(req, res) {
        try {
            const { productId, cartId, quantity } = req.body;
            await CartService.updateProductQuantityFromCart(productId, cartId, quantity);
            res.json({ message: 'Cantidad de producto actualizada' });
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error);
            res.status(500).json({ message: 'Error al actualizar la cantidad del producto' });
        }
    }

    async clearCart(req, res) {
        try {
            const { cartId } = req.params;
            await CartService.clearCart(cartId);
            res.json({ message: 'Carrito vaciado' });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ message: 'Error al vaciar el carrito' });
        }
    }
}

module.exports = new CartController();