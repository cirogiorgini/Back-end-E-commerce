const { Router } = require('express');
const server = Router();
const data = require('../assets/products.json');
const ProductManager = require('../dao/fileManager/ProductManager');
const bodyParser = require('body-parser');
const productManager = new ProductManager();

// Middleware para analizar los cuerpos de las solicitudes
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/realTimeProducts', (_, res) => {
    
    const product = {
        products: data,
        styles:['index.css'],
        scripts: ['index.js'],
        useWS: true,
    }

    res.render('realTimeProducts', product );
});

server.post('/realTimeProducts', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, status, stock } = req.body;

        const newProduct = await productManager.addProduct(title, description, price, thumbnail, code, status, stock);

        if (newProduct) {
            const io = req.app.get('io'); // Acceder al objeto io desde Express
            io.sockets.emit('newProduct', newProduct); // Emitir el evento newProduct a todos los clientes conectados
            const products = await productManager.getProducts(); // Obtener la lista actualizada de productos
            io.sockets.emit('updateFeed', products); // Emitir el evento updateFeed a todos los clientes conectados
        }

        res.redirect('/realTimeProducts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});


server.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        // Eliminar el producto del archivo
        await productManager.removeProduct(productId);
        
        const products = await productManager.getProducts();
        const io = req.app.get('io'); 

        io.emit('updateFeed', products);

        res.redirect('/realTimeProducts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});


module.exports = server;

