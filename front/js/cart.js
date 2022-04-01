let getProducts = localStorage.getItem("products");
let productsJson = JSON.parse(getProducts);
console.log(productsJson);



async function apiProducts() {
    try {
      // Appel de l'API
      let response = await fetch(`http://localhost:3000/api/products/`);
      let data = await response.json();
      console.log(data);
      
const productItems = document.querySelector("#cart__items");
// Boucle pour insérer les produits qui ont été récupérer du localStorage
for (let product of productsJson) {
  productItems.innerHTML += `
  <article class="cart__item" data-id="${product.id} data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                   <div class="cart__item__content__description">
                    <h2>Nom du produit</h2>
                    <p>${product.color}</p>
                    <p>42,00 €</p>
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

};

document.querySelectorAll('.deleteItem').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.closest('article').remove();
  });
});






} catch (error) {
    console.error(error);
  }
}
apiProducts();