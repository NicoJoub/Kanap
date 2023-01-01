
//------------------ ETAPE 1 : Recup localStorage ------------------// 

/* Récuparation des données du localStorage panier défini dans la page product 
pour les transformer en format JSON */
let localStorageProduct = JSON.parse(localStorage.getItem("panier"));
console.log(localStorageProduct)

//------------------ ETAPE 2 : Recup les infos manquantes ------------------// 

async function getOneProduct(id) {
  let response = await fetch(`http://localhost:3000/api/products/` + id)
  if (response.ok) {
    return response.json();
  } else {
    console.log(response.error)
  }
}

//------------------ ETAPE 3 : Afficher les produits ------------------// 

// -------- Creation de la fonction pour afficher les pdts 
async function displayProduct() {
  // Creation de la variable pour afficher le html 
  const cartContenair = document.querySelector("#cart__items");
  const fragment = document.createDocumentFragment()
  // pour chaque pdt du mis dans le local storage je vais incrémenter le HTML au sein de la page 
  for (const product of localStorageProduct) {
    // Creation de la variable pour récupérer le produit concerné 
    let infoProduct = await getOneProduct(product.id);
    // creation de la variable article pour integrer l'ensemble des elements données sur la page 
    let article = document.createElement("article");
    // on paramèttre la balise article en lui donnant sa class et les data dont il a besoin
    article.className = "cart__item"
    article.dataset.id = product.id
    article.dataset.color = product.color
    // creation de la page ensuite HTML pr integrer l'ensemble des élements qui correspondent au panier 
    article.innerHTML = `<div class="cart__item__img">
                  <img src="${infoProduct.imageUrl}" alt="${infoProduct.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${infoProduct.name}</h2>
                    <p>${product.color}</p>
                    <p>${infoProduct.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>`
    // creation des elements innerHTML au sein de la balise invisible
    fragment.appendChild(article);
  }
  // integration des elements HTML de la variable cartContenair qui correspond a Carte__items du HTML 
  cartContenair.appendChild(fragment);

  changeQuantity();
  validityForm();
  totalPrice();
  getNumberProduct(localStorageProduct);
  removeItem();
}

displayProduct();

//------------------ ETAPE 4 : Changement quantité & suppression  ------------------// 

function changeQuantity() {
  //Creation de la variable pour lire le nombre d'article 
  const changeItemQuantity = document.getElementsByClassName('itemQuantity')
  for (const input of changeItemQuantity) {
    //Création d'un eventListener pour voir si changement dans l'input 
    input.addEventListener("change", function (e) {

      //Rechercher les articles contenant le champ id, color et qté et récupération des infos 
      let modifyInput = e.target.closest("article");
      let idInfo = modifyInput.dataset.id;
      let colorInfo = modifyInput.dataset.color;
      let quantityInfo = e.target.value;

      // Attention si le client modifie a plus de 100 créer une alerte, si ok continuer
      if ((quantityInfo > 0) &&
        (quantityInfo <= 100)) {

        for (let i = 0; i < localStorageProduct.length; i++) {
          console.log(localStorageProduct[i]);

          // si tout est ok alors ... 
          if ((localStorageProduct[i].id === idInfo) &&
            (localStorageProduct[i].color === colorInfo)) {
            console.log("find");
            //... la quatité mise a jour du produit devient le nouveau chiffre 
            localStorageProduct[i].quantity = Number(quantityInfo)

            //mise a jour dans le localStorage 
            localStorage.setItem("panier", JSON.stringify(localStorageProduct))
            console.log(localStorageProduct)
            alert(`La quantité de votre panier a été modifiée`)
            // recharger la page 
            totalPrice();
            getNumberProduct(localStorageProduct)
          }
        }
      } else {
        alert("Vous devez saisir une quantité comprise entre 1 et 100, veuillez modifier votre choix")
      }
    })
  }
}



// Fonctions calcul des quantités et du prix du panier 
function getNumberProduct(localStorageProduct) {
  let numberProduct = 0;
  for (let i = 0; i < localStorageProduct.length; i++) {
    numberProduct += localStorageProduct[i].quantity;
  }
  document.querySelector("#totalQuantity").textContent = numberProduct;
  return numberProduct;
};


function totalPrice() {
  let cartProducts = document.querySelectorAll(".cart__item");
  let totalPrice = 0;
  for (let i = 0; i < cartProducts.length; i++) {
    let price = cartProducts[i].querySelector(".cart__item__content__description :nth-child(3)").textContent;
    let quantity = cartProducts[i].querySelector(".itemQuantity").value;
    totalPrice += parseInt(price) * parseInt(quantity);
  }
  document.querySelector("#totalPrice").textContent = totalPrice;
}

function removeItem() {
  // Creation de la variable pour supprimer un élement du panier 
  const deleteItem = document.getElementsByClassName('deleteItem');
  // creéation d'une boucle pour faire une fonction a chque click sur le bouton supprimer il va se passer tel action 
  for (const btn of deleteItem) {
    // creation d'un evenlistner pour pour l'evenement bouton supprimer 
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      // confirmation par l'utiliasteur de bien vouloir supprimer son panier 
      let deleteConfirm = confirm(`Êtes-vous sûr(e) de vouloir supprimer ce canapé de votre panier`)

      // utiliser la variable deleteConfirm dans une condition 
      if (deleteConfirm) {
        // rechercher de l'article comprenant le bouton surrpimer qui a été clique 
        let deletArticle = e.target.closest("article");
        let idInfo = deletArticle.dataset.id;
        let colorInfo = deletArticle.dataset.color;

        //Méthode filter du java pour conserver et supprimer les bons produits avec la logique inversé 
        localStorageProduct = localStorageProduct.filter(p =>
          (p.id !== idInfo) ||
          (p.color !== colorInfo))

        // Mise a jour du localstorage suite au jour 
        localStorage.setItem("panier", JSON.stringify(localStorageProduct))
        console.log(localStorageProduct)
        alert(`Le canapé a bien été supprimé de votre panier`)

        // recharger la page 
        window.location.reload();

      } else {
        alert("Votre panier n'a pas été modifié")

      }
    })
  }
}

//--------------------- ETAPE 5 : Formulaire de contact ---------------------------//

// variable regex pour le formulaire 
const regexName = new RegExp("^[A-Za-zàâäéèêëïîôöùûüç'-\\s]+$");
const regexAddress = new RegExp("^[A-Za-z0-9àâäéèêëïîôöùûüç\\-':\\s]{3,50}$");
const regexCity = new RegExp("^[A-Za-zàâäéèêëïîôöùûüç'-\\s]{2,50}$");
const regexEmail = new RegExp("^[A-Za-zA-Z0-9.-_]+[@]{1}[A-Za-zA-Z0-9.-_]+[.]{1}[A-Za-z]{2,10}$");

let checkFirstName = false;
let checkLastName = false;
let checkAddress = false;
let checkCity = false;
let checkEmail = false;

// fonction pour valider le formulaire

function firstName(value) {
  console.log(regexName.test(value));
  if (regexName.test(value) && value != "") {
    return true;
  } else {
    return false;
  }
}

function lastName(value) {
  console.log(regexName.test(value));
  if (regexName.test(value) && value != "") {
    return true;
  } else {
    return false;
  }
}

function address(value) {
  console.log(regexAddress.test(value));
  if (regexAddress.test(value) && value != "") {
    return true;
  } else {
    return false;
  }
}

function city(value) {
  console.log(regexCity.test(value));
  if (regexCity.test(value) && value != "") {
    return true;
  } else {
    return false;
  }
}

function email(value) {
  console.log(regexEmail.test(value));
  if (regexEmail.test(value) && value != "") {
    return true;
  } else {
    return false;
  }
}


function validityForm() {
  // Verifier que le panier n'est pas vide 
  if (document.getElementById("cart__items") != null) {
    // Création d'un evenListener pour faire une fonction et vérifier que l'element est correctement rentré 
    document.getElementById("firstName").addEventListener("keyup", function (e) {
      checkFirstName = firstName(e.target.value);
      if (checkFirstName) {
        document.getElementById("firstNameErrorMsg").textContent = "";
      } else {
        document.getElementById("firstNameErrorMsg").textContent = "Veuillez entrer un prénom valide, ex : Jean";
      }
    });
    document.getElementById("lastName").addEventListener("keyup", function (e) {
      checkLastName = lastName(e.target.value);
      if (checkLastName) {
        document.getElementById("lastNameErrorMsg").textContent = "";
      } else {
        document.getElementById("lastNameErrorMsg").textContent = "Veuillez entrer un nom valide, ex : Durand";

      }
    });
    document.getElementById("address").addEventListener("keyup", function (e) {
      checkAddress = address(e.target.value);
      if (checkAddress) {
        document.getElementById("addressErrorMsg").textContent = "";
      } else {
        document.getElementById("addressErrorMsg").textContent = "Veuillez entrer une adresse valide, ex : 7b rue de Stalingrad";
      }
    });
    document.getElementById("city").addEventListener("keyup", function (e) {
      checkCity = city(e.target.value);
      if (checkCity) {
        document.getElementById("cityErrorMsg").textContent = "";
      } else {
        document.getElementById("cityErrorMsg").textContent = "Veuillez entrer une ville valide, ex : Paris";
      }
    });
    document.getElementById("email").addEventListener("keyup", function (e) {
      checkEmail = email(e.target.value);
      if (checkEmail) {
        document.getElementById("emailErrorMsg").textContent = "";
      } else {
        document.getElementById("emailErrorMsg").textContent = "Veuillez entrer un mail valide, ex : jean.durand@exemple.com";
      }
    });
  }
}

//--------------------- ETAPE 6 : Envoyer les données au serveur ---------------------------//
const sendToServer = function () {
  //récupération du bouton commander
  let orderBtn = document.getElementById("order");
  // Eventlistner sur le btn order
  orderBtn.addEventListener("click", function (e) {
    e.preventDefault()
    if (localStorageProduct == null) {
      alert("Votre panier est vide, veuillez choisir un article pour valider votre commande")
      //Controle de la validité du formulaire
    } else if (
      !checkFirstName ||
      !checkLastName ||
      !checkAddress ||
      !checkCity ||
      !checkEmail
    ) {
      alert("Merci de remplir correctement le formulaire de contact afin que nous puissions valider votre commande")
    } else {
      // création de l'objet contact pour conserver les données dont on aura besoin
      let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
      };
      //enregistre les données du formulaire dans le localstorage

      // enregistre le tableau des produits dans le panier 
      let products = [];
      for (let i = 0; i < localStorageProduct.length; i++) {
        products.push(localStorageProduct[i].id);
      }

      let data = { contact, products }

      // fecth de l'url de l'api et utilisation du POST 
      fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
        })
        .then(function (value) {
          let orderId = value.orderId;
          console.log(orderId);
          alert("Votre commande a bien été enregistrée")
          window.location.href = `confirmation.html?orderId=${orderId}`;
        })
        .catch(function (error) {
          console.log("Votrer panier n'a pas pu être validée, une erreur est survenue")
          console.log(error);
        })
    }
  })
};
sendToServer();

