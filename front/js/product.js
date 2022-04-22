// Récupération de l'ID du produit dans l'url
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");
console.log(url);

async function apiProducts() {
  try {
    // Appel de l'API
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    let data = await response.json();
    console.log(data);

    const img = document.querySelector(".item__img");
    const title = document.querySelector("#title");
    const price = document.querySelector("#price");
    const description = document.querySelector("#description");
    const colors = document.querySelector("#colors");
    let color = "";
    let quantity = "";
    // Affichage du produit sur la page et intégration de ses données
    img.innerHTML = `
    <img src="${data.imageUrl}" alt"${data.altTxt}">
    `;
    title.innerText = data.name;
    price.innerText = data.price;
    description.innerText = data.description;
    // Boucle for in pour itérer sur les couleurs du produit
    for (let i in data.colors) {
      colors.innerHTML += `
        <option value="${data.colors[i]}">${data.colors[i]}</option>
        `;
    }

    const btnAddToCart = document.querySelector("#addToCart");
    const colorSelect = document.querySelector("select");
    const inputQuantity = document.querySelector('input[type="number"]');

    // Ecoute de la couleur séléctionnée
    colorSelect.addEventListener("input", (e) => {
      color = e.target.value;
    });

    //Ecoute de la quantité séléctionnée
    inputQuantity.addEventListener("input", (e) => {
      quantity = e.target.value;
    });

    // Ecoute les données entrées par l'utilisateur lors du clic sur le btn "Ajouter au panier"
    btnAddToCart.addEventListener("click", () => {
      if (inputQuantity.value == "0" || color == "") {
        alert("Veuillez choisir une quantité et une couleur");
        return;
      }
      // Déclaration de l'objet product avec les clés/valeurs de l'ID, de la quantité et de la couleur
      let product = {
        id: data._id,
        quantityProduct: parseInt(quantity),
        color: color,
      };

      let productsInLocalStorage = JSON.parse(localStorage.getItem("products"));
      // Si la clé "products" n'est pas définit dans le localStorage alors je la crée
      if (productsInLocalStorage == undefined) {
        localStorage.setItem("products", JSON.stringify([product]));
      } else {
        // Si le produit à la même couleur et ID alors j'incrémente la quantité sinon j'ajoute le produit
        let productFound = productsInLocalStorage.find(
          (p) => p.id == product.id && p.color == product.color
        );
        if (productFound) {
          productFound.quantityProduct += product.quantityProduct;
        } else {
          productsInLocalStorage.push(product);
        }
        localStorage.setItem(
          "products",
          JSON.stringify(productsInLocalStorage)
        );
      }
      alert("Produit bien ajouté au panier !");
    });
  } catch (error) {
    console.error(error);
  }
}
apiProducts();
