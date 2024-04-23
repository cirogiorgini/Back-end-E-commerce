const btnAddToCart = document.getElementById("btnAddToCart");
const productId = document.getElementById("productId");
const cartId = "6626c170c4292876fbfd9902"; // ID del carrito especificado

btnAddToCart.addEventListener('click', async (event) => {
    console.log("Botón de agregar al carrito clickeado");

    event.preventDefault();

    try {
        const response = await addProductToCart(cartId, productId.textContent);
        console.log("Producto agregado al carrito:", response);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
    }
});

async function addProductToCart(cid, pid){
    try{
        console.log("ID del producto:", pid); // Agregar esta línea
        const response = await fetch(
            `./api/carts/${cid}/products/${pid}`, {
            method:'POST',
            headers: {
    
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.json();
    }
    catch(err){
        console.log(err);
    }
}






