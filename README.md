# Guía de instalacion del proyecto
```bash
git clone https://github.com/cirogiorgini/Back-end-E-commerce.git
cd Back-end-E-commerce
npm install
nodemon src/app
code .
```


# Ejemplos de uso para la API de productos

### Metodo GET para extraer producto por su ID
```http
GET http://localhost:8080/products/:id
```

### Metodo POST para agregar un producto
```http
POST http://localhost:8080/products
```
Ejemplo del cupero de la solicitud:
```json
{
    "title": "Nuevo Producto",
    "description": "Descripción del nuevo producto",
    "price": 19.99,
    "thumbnail": "https://ejemplo.com/imagen.jpg",
    "code": "NP001",
    "status": true,
    "stock": 100,
    "category": "Electrónica"
}
```
### Metodo PUT para modificar/actualizar un producto ya existente 
```http
PUT http://localhost:8080/products/:id
```

Ejemplo del cuerpo de la solicitud:

```json
{
    "title": "Producto Actualizado",
    "price": 24.99,
    "stock": 150
}
```

### Metodo DELETE para eliminar un producto mediante su ID
```http
DELETE http://localhost:8080/products/:id

```
