const Products = require('../models/product.model');

class ProductDAO {
    async paginate(filter, options) {
        return Products.paginate(filter, options);
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