const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.carts = [];
        this.filename = path.resolve(__dirname, './cart.json');
        this.loadFromFile();
    }

    generateId() {
        // Genera un ID único para el carrito
        return Date.now().toString();
    }

    createCart() {
        // Crea un nuevo carrito
        const newCart = {
            id: this.generateId(),
            products: []
        };
        this.carts.push(newCart);
        this.saveToFile();
        return newCart;
    }

    addProductToCart(cartId, productId) {
        // Verificar si el carrito existe
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            console.log("Carrito no encontrado.");
            return false;
        }
    
        // Verificar si el producto ya está en el carrito
        const productIndex = this.carts[cartIndex].products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            // Si el producto ya existe, aumentar la cantidad en 1
            this.carts[cartIndex].products[productIndex].quantity++;
            console.log(`Cantidad del producto con ID ${productId} en el carrito ${cartId} aumentada a ${this.carts[cartIndex].products[productIndex].quantity}`);
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            this.carts[cartIndex].products.push({ id: productId, quantity: 1 });
            console.log(`Producto con ID ${productId} agregado al carrito ${cartId}`);
        }
    
        // Guardar cambios
        this.saveToFile();
        return true;
    }

    getCartById(cid) {
        return this.carts.find(cart => cart.id === cid);
    }

    saveToFile() {
        // Guarda los datos de los carritos en el archivo cart.json
        try {
            fs.writeFileSync(this.filename, JSON.stringify(this.carts, null, 2));
            console.log("Datos de carritos guardados en el archivo:", this.filename);
        } catch (error) {
            console.log("Error al guardar los datos en el archivo de carritos:", this.filename);
        }
    }

    loadFromFile() {
        // Carga los datos de los carritos desde el archivo cart.json
        try {
            const data = fs.readFileSync(this.filename);
            this.carts = JSON.parse(data);
            console.log("Datos de carritos cargados desde el archivo:", this.filename);
        } catch (error) {
            console.log("No se pudo cargar el archivo de carritos:", this.filename);
        }
    }
}

module.exports = CartManager;
