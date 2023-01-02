// fonction pour récuperer l'order ID et l'afficher 

showOrderId = function () {
    //récupere la chaine de requete 
    const url = window.location.search;
    // Analyse la chaine et cré l'objet pour récuperer les doonnées 
    const urlParams = new URLSearchParams(url)
    const orderId = urlParams.get("orderId")
    const orderIdNumber = document.getElementById("orderId")
    orderIdNumber.textContent = `${orderId}`;
}

showOrderId();

localStorage.clear();