let getProducts = localStorage.getItem("products");
let productsInLocalStorage = JSON.parse(getProducts);

async function apiProducts() {
    try {
        let totalQuantity = Number(
            document.querySelector("#totalQuantity").textContent
        );
        let totalPrice = Number(document.querySelector("#totalPrice").textContent);
        let totalQuantityShow = document.querySelector("#totalQuantity");
        let totalPriceShow = document.querySelector("#totalPrice");
        const productItems = document.querySelector("#cart__items");
        // Boucle pour itérer sur les produits du localStorage et implémentation des produits dans le HTML
        for (let product of productsInLocalStorage) {
            // Récupération des données products
            let response = await fetch(
                `http://localhost:3000/api/products/${product.id}`
            );
            let data = await response.json();
            const productIdentification = `${product.id}-${product.color}`;
            productItems.innerHTML += `
            <article ticle class="cart__item">
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
                      <input id='input-${productIdentification}' type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantityProduct}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <a id='${productIdentification}' class="deleteItem" data-id="${product.id}" data-color="${product.color}" >Supprimer</a>
                    </div>
                  </div>
                </div>
              </article>
    `;
    // Affichage du prix et de la quantité total du panier
    totalQuantity += product.quantityProduct;
    totalPrice += product.quantityProduct * data.price;
    totalQuantityShow.innerHTML = totalQuantity;
    totalPriceShow.innerHTML = totalPrice;
    
            // Permet de supprimer l'article au clic du bouton "Supprimer"
            document.addEventListener("click", function(e) { 
                if (e.target.id  === productIdentification) {
                    // Récupération des valeurs idProduct et color en utilisant .split()
                    const [idProduct, color] = productIdentification.split("-");
                    // Je sauvegarde les produits qui ont une couleur et une id différente du produit sur lequel je click
                    const remainingProducts = productsInLocalStorage.filter(
                        (product) => product.id !== idProduct && product.color !== color
                    );
                    localStorage.setItem("products", JSON.stringify(remainingProducts));
                    window.location.reload();
                }
            });
            //  Permet de modifier le quantité du produit
            document.addEventListener("change", function(e) {
                if (e.target.id === `input-${productIdentification}`) {
                    // Récupération des valeurs idProduct et color en utilisant .split() et en ignorant la première valeur qui est 'input'
                    const [_, idProduct, color] = `input-${productIdentification}`.split("-");
                    // Je recherche dans le localStorage un product qui à une couleur et un ID correspondant au product sur lequel je click
                    const product = productsInLocalStorage.find(
                        (p) => p.id == idProduct && p.color == color
                    );
                    let productQuantity = parseInt(product.quantityProduct);
                    let newQuantity = parseInt(e.target.value);
                    let productPrice = data.price;
                    // Si la nouvelle quantité est supérieur j'incrémente sinon je décrémente le prix total
                    if (newQuantity > productQuantity) {
                        totalPrice += productPrice;
                        totalPriceShow.innerHTML = totalPrice;
                    } else {
                        totalPrice -= productPrice;
                        totalPriceShow.innerHTML = totalPrice;
                    }
                    // Je sauvegarde la quantité du product dans le localStorage
                    if (product) {
                        product.quantityProduct = e.target.valueAsNumber;
                    }
                    localStorage.setItem(
                        "products",
                        JSON.stringify(productsInLocalStorage)
                    );
                    // Mise à jour de la quantité total
                    const totalQuantity = productsInLocalStorage
                        .map((product) => parseInt(product.quantityProduct))
                        .reduce((partialSum, a) => partialSum + a, 0); // .reduce((previousValue, currentValue) => previousValue + currentValue, initialValue); fonction qui est un « accumulateur » 
                    totalQuantityShow.innerHTML = totalQuantity;
                }
            });
            
        }

        //******************************* Traitement du formulaire ***********************************************/
        const form = document.querySelector(".cart__order__form");
        const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
        const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
        const addressErrorMsg = document.querySelector("#addressErrorMsg");
        const cityErrorMsg = document.querySelector("#cityErrorMsg");
        const emailErrorMsg = document.querySelector("#emailErrorMsg");

        //Création des différentes RegExp
        let nameRegExp = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u; // Interdiction des chiffres et des caractères spéciaux
        let addressRegExp = /^[a-z0-9A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u; // Interdiction des caractères spéciaux
        let emailRegExp = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$/i;

        // Fonction de validation des entrées
        function validateInput(input, regex, errorTag, errorMessage) {
            if (regex.test(input.value)) {
                errorTag.innerHTML = "";
                return true;
            } else {
                errorTag.innerHTML = errorMessage;
                return false;
            }
        }

        //Validation de l'entrée dans le champ prénom
        form.firstName.addEventListener("change", function() {
            return validateInput(this, nameRegExp, firstNameErrorMsg, "Prénom Invalide")
        });
        //Validation de l'entrée dans le champ nom
        form.lastName.addEventListener("change", function() {
            return validateInput(this, nameRegExp, lastNameErrorMsg, "Nom Invalide")
        });
        //Validation de l'entrée dans le champ de l'adresse
        form.address.addEventListener("change", function() {
            return validateInput(this, addressRegExp, addressErrorMsg, "Adresse Invalide")
        });
        //Validation de l'entrée dans le champ de la ville
        form.city.addEventListener("change", function() {
            return validateInput(this, addressRegExp, cityErrorMsg, "Nom de ville invalide")
        });
        //Validation de l'entrée dans le champ de l'email
        form.email.addEventListener("change", function() {
            return validateInput(this, emailRegExp, emailErrorMsg, "Adresse Email Invalide")
        });


        // Envoie du formulaire si toutes les données sont validées et création de l'objet contact contenant les données des produits
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            if (
                form.firstName &&
                form.lastName &&
                form.address &&
                form.city &&
                form.email
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
                // Envoi des données à l'API avec la method POST et récupération de l'orderId
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