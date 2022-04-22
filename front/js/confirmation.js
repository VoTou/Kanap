let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("orderId");


try {
  let selectOrderId = document.querySelector("#orderId");

selectOrderId.innerHTML = `<br>${orderId}`;
localStorage.removeItem('products')

} catch (error) {
  console.log(error);
}
