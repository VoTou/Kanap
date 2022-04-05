let getProducts = localStorage.getItem("products");
let productsInLocalStorage = JSON.parse(getProducts);
console.log(productsInLocalStorage);

async function apiProducts() {
    try {

      
let totalQuantity = parseInt(document.querySelector('#totalQuantity').textContent);
let totalPrice = document.querySelector('#totalPrice');     
const productItems = document.querySelector("#cart__items");
// Boucle pour insérer les produits qui ont été récupérer du localStorage et de l'API
for (let product of productsInLocalStorage) {
  let response = await fetch(`http://localhost:3000/api/products/${product.id}`);
  let data = await response.json();
  console.log(data);
  productItems.innerHTML += `
  <article class="cart__item" data-id="${product.id} data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                   <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${product.color}</p>
                    <p>${data.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantityProduct}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div> 
                </div>
              </article>
    `;
    totalQuantity.textContent += product.quantityProduct;
    totalPrice.textContent += data.price

};
console.log(totalQuantity);







document.querySelectorAll('.deleteItem').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.closest('article').remove();
  });
});

document.querySelectorAll('.itemQuantity').forEach((input) => {
  input.addEventListener('change', () => {
    document.querySelectorAll('.itemQuantity').dataset.id = 2;
});  
});



} catch (error) {
    console.error(error);
  }
}
apiProducts();


