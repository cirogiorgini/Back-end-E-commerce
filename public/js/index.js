const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  

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
                Toast.fire({
                    icon: "success",
                    title: "Producto agregado al carrito"
                  });
            } catch (error) {
                console.error('Error:', error);
                alert('Error al agregar el producto al carrito');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const generateTicketBtn = document.getElementById('generateTicketBtn');
    const cartId = generateTicketBtn.getAttribute('data-cart-id'); 

    generateTicketBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Error al generar el ticket');
            }

            const result = await response.json(); 
            
            
            console.log('Ticket generado:', result);
            alert('Ticket generado correctamente');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el ticket');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-product-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            const cartId = event.target.getAttribute('data-cart-id');

            if (!cartId) {
                console.error('No hay carrito asociado a este usuario');
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el producto del carrito');
                }

                const result = await response.json();
                console.log('Producto eliminado del carrito:', result);
                Toast.fire({
                    icon: "success",
                    title: "Producto eliminado del carrito"
                  });
                
                
                location.reload(); 
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el producto del carrito');
            }
        });
    });
});

function toggleRole(userId, currentRole) {
    fetch(`/api/users/${userId}/toggleRol`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentRole })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Rol cambiado exitosamente');
            location.reload(); 
        } else {
            alert('Error al cambiar el rol');
        }
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('createProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value,
        code: document.getElementById('code').value,
        status: document.getElementById('status').checked,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert('Producto creado correctamente');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                alert('Producto eliminado con éxito');
                location.reload(); 
            } else {
                alert('Error al eliminar el producto');
            }
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto');
        });
    }
}

async function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Usuario eliminado exitosamente');
                location.reload();
            } else {
                const errorData = await response.json();
                alert('Error al eliminar el usuario: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            alert('Error al intentar eliminar el usuario');
        }
    }
}

async function deleteInactiveUsers(adminId) {
    try {
        const response = await fetch('/api/users/deleteInactive', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminId })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Usuarios inactivos eliminados');
            location.reload();
        } else {
            alert('Error al eliminar usuarios: ' + result.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al enviar la solicitud');
    }
}












