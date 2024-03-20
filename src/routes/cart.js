const { Router } = require('express');
const server = Router();
const data = require('../products.json');
const bodyParser = require('body-parser');
const CartManager = require('../CartManager')

const cartManager = new CartManager();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());




// Ruta para crear un nuevo carrito
server.post('/api/carts/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

// Ruta para listar los productos del carrito
server.get('/api/carts/:cid', (req, res) => {
    const cid = req.params.cid;
    const cart = cartManager.getCartById(cid);
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.json(cart.products);
});

// Ruta para agregar un producto al carrito
server.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);

    // Verificar si el producto existe en el archivo products.json
    const product = data.find(product => product.id === productId);
    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Intentar agregar el producto al carrito
    const addedToCart = cartManager.addProductToCart(cartId, productId);
    if (!addedToCart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json({ message: `Producto con ID ${productId} agregado al carrito ${cartId}` });
});

module.exports = server
