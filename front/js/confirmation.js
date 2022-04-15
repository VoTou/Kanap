async function init() {

  let orderId = document.querySelector('#orderId');







  postData('http://localhost:3000/api/products/order', data)
  .then(data => { try {
    orderId.innerHTML = `${data.id}`;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
    
  });
  
  
}







