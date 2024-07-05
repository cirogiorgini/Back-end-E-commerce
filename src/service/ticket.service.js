const Ticket = require('../models/ticket.model');
const logger = require('../utils/logger')

async function createTicket(cart, purchaser) {
    const amount = cart.products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);

    const code = generateUniqueCode();

    const ticket = await Ticket.create({
        code,
        amount,
        purchaser,
    });

    logger.info('')

    return ticket;
}

function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

module.exports = {
    createTicket,
};