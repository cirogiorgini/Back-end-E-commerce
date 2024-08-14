const Products = require('../models/product.model');

class ProductDAO {
    async find(filter = {}) {
        try {
            return await Products.find(filter).lean().exec();
        } catch (error) {
            throw new Error('Error fetching products from the database');
        }
    }

    async findById(id) {
        return Products.findById(id);
    }

    async create(productData) {
        return Products.create(productData);
    }

    async updateOne(filter, update) {
        return Products.updateOne(filter, update);
    }

    async deleteOne(filter) {
        return Products.deleteOne(filter);
    }
}

module.exports = new ProductDAO();