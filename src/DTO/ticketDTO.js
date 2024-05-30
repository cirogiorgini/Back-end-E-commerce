function formatTicketResponse(ticket) {
    return {
        id: ticket._id,
        code: ticket.code,
        purchaseDatetime: ticket.purchase_datetime,
        amount: ticket.amount,
        purchaserEmail: ticket.purchaser,
    };
}

module.exports = {
    formatTicketResponse,
};
