const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ProductManager = require('./ProductManager');

app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager(); // Agrega esta línea para instanciar ProductManager

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



app.listen(8081);
