const ProductDAO = require('../dao/ProductDAO');
const CustomError = require('./errors/CustomError');
const ErrorCodes = require('./errors/errorCodes');
const { generateInvalidProductDataError } = require('./errors')

class ProductService {
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
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

        const result = await ProductDAO.paginate(filter, options);
        const products = result.docs.map(doc => doc.toObject());

        return { ...result, docs: products };
    }

    async getProductById(id) {
        const product = await ProductDAO.findById(id);
        if (!product) {
            throw new Error('No se ha encontrado ese ID');
        }
        return product;
    }

    async addProduct(title, description, price, thumbnail, code, status, stock, category) {
        if (!title || !description || !code || !category || isNaN(+price) || +price <= 0 || isNaN(+stock) || +stock < 0) {
            throw CustomError.customError({
                name: 'datos invalidos',
                message: 'Error al crear el producto, datos invalidos',
                cause : generateInvalidProductDataError({ title, description, price, thumbnail, code, status, stock, category }),
                code: ErrorCodes.INVALID_TYPES_ERROR
            });
        }

        const finalThumbnail = thumbnail ? thumbnail : 'Sin Imagen';
        const finalStatus = typeof status === 'undefined' || status === true || status === 'true';

        await ProductDAO.Create({
            title,
            description,
            price,
            thumbnail: finalThumbnail,
            code,
            status: finalStatus,
            stock,
            category
        });
    }

    async updateProduct(id, fieldsToUpdate) {
        if (Object.keys(fieldsToUpdate).length === 0) {
            throw new Error('No se proporcionaron campos para actualizar');
        }

        const updatedProduct = await ProductDAO.updateOne({ _id: id }, { $set: fieldsToUpdate });
        if (updatedProduct.nModified === 0) {
            throw new Error('No se encontró el producto para actualizar');
        }

        return updatedProduct;
    }

    async deleteProduct(id) {
        await ProductDAO.deleteOne({ _id: id });
    }
}

module.exports = new ProductService();
