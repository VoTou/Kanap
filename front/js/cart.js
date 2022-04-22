let getProducts = localStorage.getItem("products");
let productsInLocalStorage = JSON.parse(getProducts);
console.log(productsInLocalStorage);

async function apiProducts() {
  try {
    let totalQuantity = Number(
      document.querySelector("#totalQuantity").textContent
    );
    let totalPrice = Number(document.querySelector("#totalPrice").textContent);
    let totalQuantityShow = document.querySelector("#totalQuantity");
    let totalPriceShow = document.querySelector("#totalPrice");
    const productItems = document.querySelector("#cart__items");
    // Boucle pour insérer les produits qui ont été récupérer du localStorage et de l'API
    for (let product of productsInLocalStorage) {
      let response = await fetch(
        `http://localhost:3000/api/products/${product.id}`
      );
      let data = await response.json();
      const productId = `${product.id}-${product.color}`;
      productItems.innerHTML += `
  <article class="cart__item">
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
                    <div class="cart__item__content__settings__quantity ">
                      <p>Qté : </p>
                      <input id='input-${productId}' type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantityProduct}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <a id='${productId}' class="deleteItem" data-id="${product.id}" data-color="${product.color}" >Supprimer</a>
                    </div>
                  </div>
                </div>
              </article>
    `;

      // Permet de supprimer l'article du localStorage au clic du bouton "Supprimer"
      document.addEventListener("click", function (e) {
        if (e.target.id === productId) {
          const [idProduct, color] = productId.split("-");
          const remainingProducts = productsInLocalStorage.filter(
            (product) => product.id !== idProduct && product.color !== color
          );
          localStorage.setItem("products", JSON.stringify(remainingProducts));
          window.location.reload();
        }
      });
      // 
      document.addEventListener("change", function (e) {
        if (e.target.id === `input-${productId}`) {
          const [_, idProduct, color] = `input-${productId}`.split("-");
          const product = productsInLocalStorage.find(
            (p) => p.id == idProduct && p.color == color
          );
          let productQuantity = parseInt(product.quantityProduct);
          let newQuantity = parseInt(e.target.value);
          let productPrice = data.price;

          if (newQuantity > productQuantity) {
            totalPrice += productPrice;
            totalPriceShow.innerHTML = totalPrice;
          } else {
            totalPrice -= productPrice;
            totalPriceShow.innerHTML = totalPrice;
          }

          if (product) {
            product.quantityProduct = e.target.valueAsNumber;
          }
          localStorage.setItem(
            "products",
            JSON.stringify(productsInLocalStorage)
          );
          const totalQuantity = productsInLocalStorage
            .map((product) => parseInt(product.quantityProduct))
            .reduce((partialSum, a) => partialSum + a, 0);
          totalQuantityShow.innerHTML = totalQuantity;
        }
      });

      totalQuantity += product.quantityProduct;
      totalPrice += product.quantityProduct * data.price;
      totalQuantityShow.innerHTML = totalQuantity;
      totalPriceShow.innerHTML = totalPrice;
    }

    //******************************* Traitement du formulaire ***********************************************/
    const form = document.querySelector(".cart__order__form");
    const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
    const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
    const addressErrorMsg = document.querySelector("#addressErrorMsg");
    const cityErrorMsg = document.querySelector("#cityErrorMsg");
    const emailErrorMsg = document.querySelector("#emailErrorMsg");

    //Création des différentes RegExp
    let nameRegExp =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let addressRegExp =
      /^[a-z0-9A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let emailRegExp = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/i;

    // Fonction pour la validation du prénom
    const validFirstName = function (inputFirstName) {
      if (nameRegExp.test(inputFirstName.value)) {
        firstNameErrorMsg.innerHTML = "";
        return true;
      } else {
        firstNameErrorMsg.innerHTML = "Prénom Invalide";
        return false;
      }
    };

    // Fonction pour la validation du nom
    const validLastName = function (inputLastName) {
      if (nameRegExp.test(inputLastName.value)) {
        lastNameErrorMsg.innerHTML = "";
        return true;
      } else {
        lastNameErrorMsg.innerHTML = "Nom Invalide";
        return false;
      }
    };

    // Fonction pour la validation de l'adresse
    const validAddress = function (inputAddress) {
      if (addressRegExp.test(inputAddress.value)) {
        addressErrorMsg.innerHTML = "";
        return true;
      } else {
        addressErrorMsg.innerHTML = "Adresse Invalide";
        return false;
      }
    };

    // Fonction pour la validation de la ville
    const validCity = function (inputCity) {
      if (addressRegExp.test(inputCity.value)) {
        cityErrorMsg.innerHTML = "";
        return true;
      } else {
        cityErrorMsg.innerHTML = "Nom de ville invalide";
        return false;
      }
    };

    // Fonction pour la validation de l'email
    const validEmail = function (inputEmail) {
      if (emailRegExp.test(inputEmail.value)) {
        emailErrorMsg.innerHTML = "";
        return true;
      } else {
        emailErrorMsg.innerHTML = "Adresse Email Invalide";
        return false;
      }
    };

    //Validation de l'entrée dans le champ prénom
    form.firstName.addEventListener("change", function () {
      validFirstName(this);
    });
    //Validation de l'entrée dans le champ nom
    form.lastName.addEventListener("change", function () {
      validLastName(this);
    });
    //Validation de l'entrée dans le champ de l'adresse
    form.address.addEventListener("change", function () {
      validAddress(this);
    });
    //Validation de l'entrée dans le champ de la ville
    form.city.addEventListener("change", function () {
      validCity(this);
    });
    //Validation de l'entrée dans le champ de l'email
    form.email.addEventListener("change", function () {
      validEmail(this);
    });

    // Envoie du formulaire si toutes les données sont validées et création de l'objet contact contenant les données des produits
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (
        validFirstName(form.firstName) &&
        validLastName(form.lastName) &&
        validAddress(form.address) &&
        validCity(form.city) &&
        validEmail(form.email)
      ) {
        const data = {
          contact: {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value,
          },
          products: productsInLocalStorage.map((product) => product.id),
        };
        fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const orderId = data.orderId;
            // Redirection sur la page de confirmation et affichage de l'orderId
            window.location = "confirmation.html?orderId=" + orderId;
            console.log(orderId);
          })
          .catch((error) => console.error(error));
      }
    });
  } catch (err) {
    console.log(`Erreur : ${err}`);
  }
}
apiProducts();
