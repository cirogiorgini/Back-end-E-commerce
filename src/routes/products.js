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
    // Obtener los datos del cuerpo de la solicitud
    const { title, description, code, price, stock, thumbnails } = req.body;

    // Verificar que todos los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock) {
        return res.status(400).json({ message: "Todos los campos son obligatorios excepto thumbnails" });
    }

    // Crear un nuevo producto con los datos proporcionados
    const product = {
        title,
        description,
        code,
        price,
        status: true, // Valor predeterminado para el estado
        stock,
        thumbnails: thumbnails || [] // Si no se proporciona thumbnails, se establece como un array vacío
    };

    // Agregar el nuevo producto usando la instancia de productManager
    productManager.addProduct(product);

    // Emitir el evento newProduct a todos los clientes conectados
    io.emit('newProduct', product);

    // Enviar una respuesta con el producto agregado y el código de estado 201 (Created)
    res.status(201).json(product);
});

// Ruta para actualizar un producto por su ID
server.put('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid); // Obtener el ID del parámetro de la URL
    const updatedProductData = req.body; // Obtener los datos del cuerpo de la solicitud

    // Verificar que el producto exista
    const productToUpdate = productManager.getProductById(pid);
    if (!productToUpdate) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar los campos del producto
    productManager.updateProduct(pid, updatedProductData);

    // Obtener el producto actualizado
    const updatedProduct = productManager.getProductById(pid);

    // Emitir el evento updateProduct a todos los clientes conectados
    io.emit('updateProduct', updatedProduct);

    // Enviar una respuesta con el producto actualizado
    res.json(updatedProduct);
});

// Ruta para eliminar un producto por su ID
server.delete('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid); // Obtener el ID del parámetro de la URL

    // Verificar que el producto exista
    const productToDelete = productManager.getProductById(pid);
    if (!productToDelete) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar el producto
    productManager.removeProduct(pid);

    // Emitir el evento updateFeed a todos los clientes conectados
    io.emit('updateFeed', productManager.getAllProducts());

    // Enviar una respuesta indicando que el producto fue eliminado
    res.json({ message: `Producto con ID ${pid} eliminado` });
});

module.exports = server