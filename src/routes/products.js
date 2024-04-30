const { Router } = require('express');
const server = Router();
const data = require('../assets/products.json');
const ProductManager = require('../dao/fileManager/ProductManager');
const bodyParser = require('body-parser');
const productManager = new ProductManager();



server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());



// Ruta para obtener todos los productos
server.get('/api/products', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        const products = await productManager.getProducts({ limit, page, sort, query });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

server.get('/api/products/:pid', (req, res) => {   
    const pid = +req.params.pid;
    const prod = data.find(p => p.id === pid);
    res.json(prod);
});

server.post('/api/products', (req, res) => {
   
    const { title, description, code, price, stock, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock) {
        return res.status(400).json({ message: "Todos los campos son obligatorios excepto thumbnails" });
    }

    // Crear un nuevo producto con los datos proporcionados
    const product = {
        title,
        description,
        code,
        price,
        status: true, 
        stock,
        thumbnails: thumbnails || [] 
    };

    productManager.addProduct(product);

    io.emit('newProduct', product);

    res.status(201).json(product);
});

// Ruta para actualizar un producto por su ID
server.put('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid); 
    const updatedProductData = req.body; 

    
    const productToUpdate = productManager.getProductById(pid);
    if (!productToUpdate) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    productManager.updateProduct(pid, updatedProductData);

    const updatedProduct = productManager.getProductById(pid);

    io.emit('updateProduct', updatedProduct);

    res.json(updatedProduct);
});


server.delete('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid); 

    const productToDelete = productManager.getProductById(pid);
    if (!productToDelete) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    productManager.removeProduct(pid);

    io.emit('updateFeed', productManager.getAllProducts());

    res.json({ message: `Producto con ID ${pid} eliminado` });
});

module.exports = server