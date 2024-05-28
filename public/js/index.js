document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-card').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            const cartId = event.target.getAttribute('data-cart-id');

            if (!cartId) {
                console.error('No hay carrito asociado a este usuario');
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al agregar el producto al carrito');
                }

                const result = await response.json();
                console.log('Producto agregado al carrito:', result);
                alert('Producto agregado al carrito');
            } catch (error) {
                console.error('Error:', error);
                alert('Error al agregar el producto al carrito');
            }
        });
    });
});





