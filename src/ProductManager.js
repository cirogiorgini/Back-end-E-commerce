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
        this.filename = path.resolve(__dirname, './products.json');
        this.loadFromFile();
    }

    generateId() {
        return this.nextId++;
    }

    addProduct(title, description, price, thumbnail, code, stock, status) {
        // Validar que no se repita el campo "code"
        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.log("Ya existe un producto con este código.");
            return;
        }

        // Generar un ID para el nuevo producto
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
        try {
            fs.writeFileSync(this.filename, JSON.stringify(this.products, null, 2));
            console.log("Datos guardados en el archivo:", this.filename);
        } catch (error) {
            console.log("Error al guardar los datos en el archivo:", error.message);
        }
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.filename);
            this.products = JSON.parse(data);
            this.nextId = Math.max(...this.products.map(product => product.id)) + 1;
            console.log("Datos cargados desde el archivo:", this.filename);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("El archivo no existe. Creando uno nuevo.");
                this.saveToFile(); // Crear un archivo vacío si no existe
            } else {
                console.log("Error al cargar el archivo:", error.message);
            }
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
manager.addProduct("Phone", "Smartphone con excelentes características", 699.99, "https://www.bing.com/images/search?view=detailV2&ccid=6SodXgYw&id=A68DD3384855073E42A38744B824A35610EB257C&thid=OIP.6SodXgYwWAhJ475st-KAdgHaHa&mediaurl=https%3a%2f%2fwww.refurbished.nl%2fcache%2fimages%2fiphone-12-voorkant-dichtbij-zwart_600x600_adaptiveResize_16777215.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.e92a1d5e0630580849e3be6cb7e28076%3frik%3dfCXrEFajJLhEhw%26pid%3dImgRaw%26r%3d0&exph=600&expw=600&q=iphone&simid=608033942335215771&FORM=IRPRST&ck=63BABA9331952C7F81A9772522F3C4F8&selectedIndex=14&itb=1&qft=+filterui%3aphoto-transparent&ajaxhist=0&ajaxserp=0", "PHN001", 10);
manager.addProduct("Laptop", "Laptop de alto rendimiento para profesionales", 1499.99, "https://th.bing.com/th/id/R.677bc3daa911c5083220097d5e7bedd4?rik=hxdL%2fV5LoxXYNg&riu=http%3a%2f%2fjetarinc.weebly.com%2fuploads%2f3%2f9%2f2%2f3%2f39238287%2fs243516740636381673_p1_i1_w600.png&ehk=U%2bGGnffMDKGbJmLQePdtc1yrs6wyny3k%2figgZJCpbM4%3d&risl=&pid=ImgRaw&r=0", "LPT002", 5);
manager.addProduct("mouse", "mouse de alto rendimiento para profesionales", 200.99, "https://macmagazine.com.br/wp-content/uploads/2018/01/07-mx01.png", "MOS302", 7);

// Imprimir productos
manager.printProducts();

manager.removeProduct(5);

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
