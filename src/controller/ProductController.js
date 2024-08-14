const ProductService = require('../service/ProductService');

class ProductController {
    async getProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts(req.query);
            res.status(200).json(products);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw error;
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            res.status(500).json({ message: 'Error al obtener el producto' });
        }
    }

    async addProduct(req, res, next) {
        try {
            const { title, description, price, thumbnail, code, status, stock, category } = req.body;
            const owner = req.user.rol === 'admin' ? 'admin' : req.user.email;
    
            await ProductService.addProduct(title, description, price, thumbnail, code, status, stock, category, owner);
            res.status(201).json({ message: 'Producto agregado correctamente' });
        } catch (error) {
            next(error);  
        }
    }
    

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const fieldsToUpdate = req.body;
            await ProductService.updateProduct(id, fieldsToUpdate);
            res.json({ message: 'Producto actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            res.status(500).json({ message: 'Error al actualizar el producto' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await ProductService.deleteProduct(id);
            console.log("producto eliminado")
            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            res.status(500).json({ message: 'Error al eliminar el producto' });
        }
    }
}

module.exports = new ProductController();
