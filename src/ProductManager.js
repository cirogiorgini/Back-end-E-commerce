const fs = require('fs');
const path = require('path');

class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
        this.filename = path.resolve(__dirname, 'products.json');
        this.loadFromFile();
    }

    generateId() {
        return this.nextId++;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        // Validar que no se repita el campo "code"
        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.log("Ya existe un producto con este código.");
            return;
        }

        const id = this.generateId();
        const product = new Product(id, title, description, price, thumbnail, code, stock);
        this.products.push(product);
        console.log(`Producto agregado con ID: ${id}`);
        this.saveToFile();
    }

    removeProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            console.log(`Producto con ID ${id} eliminado.`);
            this.saveToFile();
        } else {
            console.log(`No se encontró ningún producto con ID ${id}.`);
        }
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            console.log(`Producto con ID ${id} actualizado.`);
            this.saveToFile();
        } else {
            console.log(`No se encontró ningún producto con ID ${id}.`);
        }
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado.");
            return null;
        }
    }

    saveToFile() {
        fs.writeFileSync(this.filename, JSON.stringify(this.products, null, 2));
        console.log("Datos guardados en el archivo:", this.filename);
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.filename);
            this.products = JSON.parse(data);
            this.nextId = Math.max(...this.products.map(product => product.id)) + 1;
            console.log("Datos cargados desde el archivo:", this.filename);
        } catch (error) {
            console.log("No se pudo cargar el archivo:", this.filename);
        }
    }

    printProducts() {
        console.log("Lista de Productos:");
        this.products.forEach(product => {
            console.log(`ID: ${product.id}`);
            console.log(`Título: ${product.title}`);
            console.log(`Descripción: ${product.description}`);
            console.log(`Precio: ${product.price}`);
            console.log(`Thumbnail: ${product.thumbnail}`);
            console.log(`Código: ${product.code}`);
            console.log(`Stock: ${product.stock}`);
            console.log();
        });
    }
}

module.exports = ProductManager;

// Ejemplo de uso:
const manager = new ProductManager();

// Agregar productos
manager.addProduct("Phone", "Smartphone con excelentes características", 699.99, "phone.jpg", "PHN001", 10);
manager.addProduct("Laptop", "Laptop de alto rendimiento para profesionales", 1499.99, "laptop.jpg", "LPT002", 5);
manager.addProduct("mouse", "mouse de alto rendimiento para profesionales", 200.99, "mouse.jpg", "MOS302", 7);

// Imprimir productos
manager.printProducts();

// Actualizar un producto
const updatedProduct = {
    title: "Nuevo Teléfono",
    description: "Teléfono con características mejoradas",
    price: 799.99,
    thumbnail: "new_phone.jpg",
    code: "PHN002",
    stock: 15
};
manager.updateProduct(1, updatedProduct);

// Imprimir productos actualizados
manager.printProducts();

