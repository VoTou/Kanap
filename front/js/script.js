async function apiProducts() {
  try {
    // Appel de l'API
    let response = await fetch("http://localhost:3000/api/products");
    let data = await response.json();

    const sectionHtml = document.getElementById("items");
    
    //Boucle pour afficher les données des Kanap
    
    for (let kanap of data) {
      sectionHtml.innerHTML += `
        <a href="./product.html?id=${kanap._id}">
            <article>
                <img src="${kanap.imageUrl}" alt"${kanap.altTxt}">
                <h3 class="productName">${kanap.name}</h3>
                <p class="productDescription">${kanap.description}</p>
            </article> 
        </a>       
        `;
    }
  } catch (error) {
    console.error(error);
  }
}
apiProducts();
