const ProductDAO = require('../dao/ProductDAO');
const CustomError = require('./errors/CustomError');
const ErrorCodes = require('./errors/errorCodes');
const UserDAO = require('../dao/UserDAO')
const transport = require('../utils/transport')
const { generateInvalidProductDataError } = require('./errors')

class ProductService {
    async getAllProducts() {
        try {
            const products = await ProductDAO.find();
            return products;
        } catch (error) {
            throw new Error('Error al extraer los productos');
        }
    }

    async getProductById(id) {
        const product = await ProductDAO.findById(id);
        if (!product) {
            throw new Error('No se ha encontrado ese ID');
        }
        return product;
    }

    async addProduct(title, description, price, thumbnail, code, status, stock, category, owner) {
        if (!title || !description || !code || !category || isNaN(+price) || +price <= 0 || isNaN(+stock) || +stock < 0 || !owner) {
            throw CustomError.customError({
                name: 'datos invalidos',
                message: 'Error al crear el producto, datos invalidos',
                cause : generateInvalidProductDataError({ title, description, price, thumbnail, code, status, stock, category }),
                code: ErrorCodes.INVALID_TYPES_ERROR
            });
        }
    
        const finalThumbnail = thumbnail || 'Sin Imagen';
        const finalStatus = typeof status === 'undefined' || status === true || status === 'true';
    
        await ProductDAO.create({
            title,
            description,
            price,
            thumbnail: finalThumbnail,
            code,
            status: finalStatus,
            stock,
            category,
            owner
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
            try {
                const product = await ProductDAO.findById(id);
        
                if (!product) {
                    throw new Error('El producto no existe');
                }
        
                await ProductDAO.deleteOne({ _id: id });
        
                if (product.owner !== 'admin') {
                    const user = await UserDAO.findUserByEmail(product.owner);
        
                    if (user && user.rol === 'premium') {
                        try {
                            await transport.sendMail({
                                from: 'giorginiciro@gmail.com',
                                to: user.email,
                                subject: 'Notificación de eliminación de producto',
                                html: `
                                <div>
                                    <p>Hola ${user.firstName},</p>
                                    <p>El producto con ID ${id} ha sido eliminado de tu cuenta.</p>
                                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                                    <p>Saludos,</p>
                                    <p>El equipo de tu aplicación</p>
                                </div>
                                `,
                            });
                            console.log('Correo enviado exitosamente a:', user.email);
                        } catch (error) {
                            console.error('Error al enviar el correo:', error);
                        }
                    }
                }
        
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                throw error;
            }
        }
        
    }

module.exports = new ProductService();
