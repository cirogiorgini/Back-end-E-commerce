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

# Ejemplos de uso para la API de carts

### Metodo GET para obtener todos los carritos
```http
GET http://localhost:8080/carts
```
### metodo POST para agregar un nuevo carrito 
```http
POST http://localhost:8080/carts
```

### Metodo POST para agregar producto al carrito
```http
POST http://localhost:8080/carts/:cid/product/:pid
```

**Parametros de la solicitud:**
+ cid: ID del carrito al que se agregará el producto.
+ pid: ID del producto que se agregará al carrito.

### Metodo GET para obtener un carrito por su ID
```http
GET http://localhost:8080/carts/:cid
```
**Parametros de la solicitud**
+ cid: ID del carrito que quieras visualizar

### Metedo DELETE para eliminar un producto de un carrito
```http
DELETE http://localhost:8080/carts/:cid/product/:pid
```
**Parametros de la solicitud:**
+ cid: ID del carrito al que se eliminará el producto.
+ pid: ID del producto que se eliminará del carrito.

### Metodo PUT para actualizar la lista de productos en un carrito existente
```http
PUT http://localhost:8080/carts/:cid
```
**Parametros de la solicitud**
+ cid: ID del carrito que quieras actualizar

Ejemplo del cuerpo de la solicitud:
```json
{
    "products": [
        {
            "product": "61234c6079b1e0219d69c53a",
            "quantity": 2
        },
        {
            "product": "61234c6079b1e0219d69c53b",
            "quantity": 1
        },
        {
            "product": "61234c6079b1e0219d69c53c",
            "quantity": 3
        }
    ]
}
```
### Metodo PUT para actualizar la cantidad de un producto en un carrito 
```http
PUT http://localhost:8080/carts/:cid/product/:pid
```
**Parametros de la solicitud:**
+ cid: ID del carrito que quieras actualizar.
+ pid: ID del producto que quieras incrementar la cantidad.

Ejemplo del cuerpo de la solicitud:
```json
{
    "quantity": 5
}
```

### Metodo DELETE para eliminar todos los productos de un carrito
```http
DELETE http://localhost:8080/carts/:cid
```
**Parametros de la solicitud:**
+ cid: ID del carrito se vaciará.






