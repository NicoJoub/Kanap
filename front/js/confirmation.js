// fonction pour récuperer l'order ID et l'afficher 

showOrderId = function () {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url)
    const orderId = urlParams.get("orderId")
    const orderIdNumber = document.getElementById("orderId")
    orderIdNumber.textContent = `${orderId}`;
}

showOrderId();

localStorage.clear();