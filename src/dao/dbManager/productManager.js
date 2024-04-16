const { Products } = require('../models');

class ProductManager {

    constructor() { }

    async prepare() {
        try {
            // Realizar la inicialización específica aquí, por ejemplo, conexión a la base de datos
            // En este ejemplo, no es necesario realizar ninguna inicialización especial
            console.log("ProductManager preparado");
        } catch (error) {
            console.error("Error al preparar ProductManager:", error);
            throw new Error("Error al preparar ProductManager");
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            let filter = {};
            let options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: {}
            };
    
            
            if (query) {
                filter = { category: query }; 
            }
    
            
            if (sort === 'asc' || sort === 'desc') {
                options.sort.price = sort === 'asc' ? 1 : -1; 
            }
    
            const products = await Products.paginate(filter, options);
            
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw new Error('Error al obtener los productos');
        }
    }
    

    async getProductById(id) {
        try {
            const product = await Products.findOne({ _id: id });

            if (product) {
                return product;
            } else {
                throw new Error('No se ha encontrado ese ID');
            }
        } catch (error) {
            console.error('no se pudo extraer el producto', error);
            throw new Error('no se pudo extraer el producto');
        }
    }


    
    async addProduct(title, description, price, thumbnail, code, status, stock, category) {

        const invalidOptions = isNaN(+price) || +price <= 0 || isNaN(+stock) || +stock < 0;
       
        if (!title || !description || !code || !category || invalidOptions) {
            throw new Error('Error al validar los datos');
        };

        const finalThumbnail = thumbnail ? thumbnail : 'Sin Imagen';

       
        if (typeof status === 'undefined' || status === true || status === 'true') {
            status = true;
        } else {
            status = false;
        }

        try {
            await Products.create({
                title,
                description,
                price,
                thumbnail: finalThumbnail,
                code,
                status,
                stock,
                category
            });

            console.log('Producto agregado correctamente');
        } catch (error) {
            console.error('Error al agregar el producto desde DB', error);
            throw new Error('Error al agregar el producto desde DB');
        }
    }

    async updateProduct(id, fieldsToUpdate) {
        try {
            // Verifica si hay campos para actualizar
            if (Object.keys(fieldsToUpdate).length === 0) {
                throw new Error('No se proporcionaron campos para actualizar');
            }
    
            // Actualiza el producto en la base de datos
            const updatedProduct = await Products.updateOne({ _id: id }, { $set: fieldsToUpdate });
    
            // Verifica si se encontró y actualizó el producto
            if (updatedProduct.nModified === 0) {
                throw new Error('No se encontró el producto para actualizar');
            }
    
            return updatedProduct;
        } catch (error) {
            // Maneja los errores de manera adecuada
            console.error('Error al actualizar el producto en la base de datos:', error.message);
            throw new Error('Error al actualizar el producto en la base de datos');
        }
    }
    

    async deleteProduct(productId) {
        try {
            await Products.deleteOne({ _id: productId });
        } catch (error) {
            throw new Error('Error al eliminar el producto en la base de datos');
        }
    }
}

module.exports = ProductManager;