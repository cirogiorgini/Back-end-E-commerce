const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser');
const app = express();
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager')

const productManager = new ProductManager(); 
const cartManager = new CartManager();


//config handlebars
app.engine('handlebars', handlebars.engine())
app.set(`views`, `${__dirname}/views`)
app.set(`view engine`, `handlebars`)

app.use(express.json())
app.use(bodyParser.json());+
app.use(express.static(`${__dirname}/../public`))
app.use(express.urlencoded({ extended: true }));


const data = require('./products.json');


// Ruta para obtener todos los productos
app.get('/api/products/', (req, res) => {
    const limit = req.query.limit; 
    let products = data;
    
    ///Ejemplo: /?limit=2
    if (limit) {
        const limitValue = parseInt(limit);
        if (!isNaN(limitValue) && limitValue >= 0) {
            products = products.slice(0, limitValue);
        } else {
            return res.status(400).json({ error: 'El parámetro de consulta "limit" debe ser un número positivo.' });
        }
    }
    
    res.json(products);
});

app.get(`/api/products/:pid`, (req, res) => {   
    const pid = +req.params.pid;
    const prod = data.find(p => p.id === pid);
    res.json(prod);
});

app.post('/api/products', (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Verificar que todos los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !stock || !category) {
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
        category,
        thumbnails: thumbnails || [] // Si no se proporciona thumbnails, se establece como un array vacío
    };

    // Agregar el nuevo producto usando la instancia de productManager
    productManager.addProduct(product);

    // Enviar una respuesta con el producto agregado y el código de estado 201 (Created)
    res.status(201).json(product);
});

// Ruta para actualizar un producto por su ID
app.put('/api/products/:pid', (req, res) => {
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

    // Enviar una respuesta con el producto actualizado
    res.json(updatedProduct);
});

// Ruta para eliminar un producto por su ID
app.delete('/api/products/:pid', (req, res) => {
    const pid = parseInt(req.params.pid); // Obtener el ID del parámetro de la URL

    // Verificar que el producto exista
    const productToDelete = productManager.getProductById(pid);
    if (!productToDelete) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar el producto
    productManager.removeProduct(pid);

    // Enviar una respuesta indicando que el producto fue eliminado
    res.json({ message: `Producto con ID ${pid} eliminado` });
});

// Ruta para crear un nuevo carrito
app.post('/api/carts/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

// Ruta para listar los productos del carrito
app.get('/api/carts/:cid', (req, res) => {
    const cid = req.params.cid;
    const cart = cartManager.getCartById(cid);
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.json(cart.products);
});

// Ruta para agregar un producto al carrito
app.post('/api/carts/:cid/product/:pid', (req, res) => {
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

app.get(`/home`, (_, res) => {
    
    const product = {
        products: data,
        styles:['index.css']
    }

    res.render('home', product)
})


app.listen(8080);
