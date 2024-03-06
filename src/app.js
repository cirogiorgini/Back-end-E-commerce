const express = require('express');
const app = express();

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


app.listen(8080);
