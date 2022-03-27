let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");
console.log(url);

async function apiProducts() {
  try {
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    let data = await response.json();
    console.log(data);

    const img = document.querySelector('.item__img');
    const title = document.querySelector('#title');
    const price = document.querySelector('#price');
    const description = document.querySelector('#description');
    const colors = document.querySelector('#colors');
    
    img.innerHTML = `
    <img src="${data.imageUrl}" alt"${data.altTxt}">
    `;
    title.innerText = data.name;
    price.innerText = data.price;
    description.innerText = data.description;

    for (let i in data.colors)
     {
        colors.innerHTML += `
        <option value="${data.colors[i]}">${data.colors[i]}</option>
        `
    };
  } catch (error) {
    console.error(error);
  }
}
apiProducts();