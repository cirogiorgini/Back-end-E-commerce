const { Carts, Products } = require('../models');

class CartManager {

    constructor() { }

    async prepare() {
        try {
            // Realizar la inicialización específica aquí, por ejemplo, conexión a la base de datos
            // En este ejemplo, no es necesario realizar ninguna inicialización especial
            console.log("CartManager preparado");
        } catch (error) {
            console.error("Error al preparar CartManager:", error);
            throw new Error("Error al preparar CartManager");
        }
    }

    // Se obtienen todos los carritos del archivo de forma similar que en ProductManager
    async getCarts() {
        try {
            const carts = await Carts.find();
            return carts;
        } catch (error) {
            throw new Error('Error al importar los carritos');
        }
    }

    // Agregar un nuevo carrito
    async addCart() {
        try {
            const newCart = await Carts.create({
                products: []
            });
            return newCart;
        } catch (error) {
            throw new Error('Error al agregar un nuevo carrito.')
        }
    }

    // Agregar productos al carrito
   // Agregar productos al carrito
   async addProductToCart(productId, cartId) {
    try {
        // Eliminar espacios en blanco y caracteres de nueva línea al inicio y al final del ID del producto
        productId = productId.trim();

        const product = await Products.findById(productId);
        if (!product) {
            throw new Error('El producto no existe');
        }

        const cart = await Carts.findById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe');
        }

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        console.log('Producto agregado al carrito correctamente');
        return cart;
    } catch (error) {
        console.error('Error en addProductToCart:', error);
        throw new Error('Hubo un error al agregar un producto al carrito:', error); // Modificación aquí
    }
    }



    async getCartById(cartId) {
        try {
            const cart = await Carts.findById(cartId).populate('products.product');
            return cart;
        } catch (err) {
            console.error(err)
            throw new Error('Hubo un error al obtener el ID del carrito.')
        }
    }

    async deleteProductFromCart(productId, cartId) {
        try {
            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }
    
            const productIndex = cart.products.findIndex(p => p._id.equals(productId));
            if (productIndex === -1) {
                throw new Error('El producto no se encontró en el carrito.');
            }
    
            await cart.updateOne({ $pull: { products: { _id: productId } } });
    
            console.log(`Se eliminó el producto ${productId} del carrito ${cartId}`);
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Hubo un error al eliminar el producto del carrito');
        }
    }
    

    async updateCart(cartId, products) {
        try {
            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            for (const { product: productId, quantity } of products) {
                const product = await Products.findById(productId);
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

            await cart.save();

            console.log(`Se actualizó el carrito ${cartId}`);
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('Error al actualizar el carrito');
        }
    }

    async updateProductQuantityFromCart(productId, cartId, quantity) {
        try {
            // Buscar el carrito por su ID
            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }
    
            // Encontrar el índice del producto en el carrito
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId.toString());
            if (existingProductIndex !== -1) {
                // Actualizar la cantidad del producto
                cart.products[existingProductIndex].quantity = quantity;
    
                // Guardar los cambios en el carrito
                await cart.save();
    
                console.log(`Cantidad del producto ${productId} actualizada en el carrito ${cartId}`);
            } else {
                throw new Error('No se pudo encontrar el producto en el carrito');
            }
        } catch (error) {
            console.error('Hubo un error al actualizar la cantidad del producto:', error);
            throw new Error('Hubo un error al actualizar la cantidad del producto',error);
        }
    }
    

    async clearCart(cartId) {
        try {
            const existingCart = await this.getCartById(cartId);
            if (!existingCart) {
                throw new Error('El carrito no existe');
            }
    
            await Carts.updateOne({ _id: cartId }, { $set: { products: [] } });
            console.log(`Todos los productos del carrito ${cartId} han sido eliminados`);
        } catch (error) {
            console.error('Hubo un error al vaciar el carrito:', error);
            throw new Error('Hubo un error al vaciar el carrito', error);
        }
    }
    
};

module.exports = CartManager;
