const express = require('express');
const router = express.Router();
const CartManager = require('../dao/dbManager/cartManager');

const cartManager = new CartManager();

// Ruta para crear un nuevo carrito
router.post('/api/carts/', async (req, res) => {
    try {
        await cartManager.addCart();
        res.status(201).json({ message: 'Nuevo carrito creado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para listar los productos del carrito
router.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para agregar un producto al carrito
router.post('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    console.log(cid, pid);  

    try {
        await cartManager.addProductToCart(pid, cid);
        res.json({ message: `Producto con ID ${pid} agregado al carrito ${cid}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Eliminar todos los productos del carrito
router.delete('/api/carts/:cid/', async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManager.clearCart(cid);
        res.json({ message: `Todos los productos del carrito ${cid} han sido eliminados` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// PUT: Actualizar el carrito con un arreglo de productos
router.put('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        await cartManager.updateCart(cid, products);
        res.json({ message: `Carrito ${cid} actualizado con éxito` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        await cartManager.updateProductQuantityFromCart(pid, cid, quantity);
        res.json({ message: `Cantidad del producto ${pid} en carrito ${cid} actualizada a ${quantity}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
