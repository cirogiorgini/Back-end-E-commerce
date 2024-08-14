const CartDAO = require('../dao/CartDAO');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const TicketService = require('../service/ticket.service');
const ProductService = require('../service/ProductService');

class CartService {
    async getCarts() {
        return await CartDAO.getCarts();
    }

    async addCart() {
        return await CartDAO.addCart();
    }

    async addProductToCart(productId, cartId, req) {
        try {
            if (!req || !req.session || !req.session.user) {
                throw new Error('La sesión del usuario no está disponible');
            }

            console.log('Sesión del usuario:', req.session.user);
    
            const userEmail = req.session.user.email;

            if (req.session.user.rol === 'admin'){
                throw new Error('no puedes agregar items al carrito siendo administrador') 
            }
    
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('El producto no existe');
            }
    
            if (product.owner === userEmail) {
                throw new Error('No puedes agregar un producto de tu propio propietario al carrito');
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

    async deleteProductFromCart(cartId, productId, userId) {
        try {
           
            const cart = await CartDAO.getCartById(cartId);
    
            if (!cart) {
                throw new Error('Cart not found');
            }
    
            const product = cart.products.find(item => item.product.equals(productId));
    
            if (!product) {
                throw new Error('Product not found in cart');
            }
    
            
            const deletedProduct = await CartDAO.deleteProductFromCart(cartId, productId);
    
            
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error deleting product from cart: ${error.message}`);
        }
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

    async purchaseCart(cartId, userId) {
        const cart = await Cart.findById(cartId).populate('products.product');
    
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        const ticket = await TicketService.createTicket(cart, userId);
    
        await Promise.all(cart.products.map(async (item) => {
            const product = item.product;
            const quantity = item.quantity;
    
            if (product.stock >= quantity) {
                product.stock -= quantity;
                await product.save();
            } else {
                throw new Error(`No hay suficiente stock para el producto ${product.title}`);
            }
        }));
    
        cart.products = [];
        await cart.save();
    
        return ticket;
    }
}

module.exports = new CartService();
