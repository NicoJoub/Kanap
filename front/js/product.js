
//--------------------- ETAPE ---------------------//

//--------------------- ETAPE 1 : Recup l'ID ---------------------//
const pageProduct = window.location.search; //recupere l'uRL de la page 
const url = new URLSearchParams(pageProduct); // cree la page produit 
const idProduct = url.get("id") // retourne la valeur associée au parametre donné ID

//--------------------- ETAPE 2 : Fonction getProduct(Id) ---------------------//
//--------------------- Pour récupérer dans l'API, un seul produit -----------//
async function getProduct(id) {
    //on récupere les données de l'API pour un seul produit le await, permet d'attendre sa réponse, sinon ont aura une promesse de réponse et non pas les infos
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    if (response.ok) {
        return response.json();
    } else {
        console.log(response.error);
    }
}

//--------------------- ETAPE 3 : Fonction afficher les info du pdt  ---------------------//
async function displayInfo() {
    //j'appelle la fonction getProduct 
    let product = await getProduct(idProduct);
    //insertion de l'image : création d'une variable pour créer l'élement image à insérer
    let picture = document.createElement('img');
    let select = document.getElementById("colors");
    picture.src = product.imageUrl;
    picture.alt = product.altTxt;
    document.querySelector('.item__img').appendChild(picture);
    // insertion du texte 
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;
    //Mise en place du choix des couleurs avec une boucle for pour chaque couleur en fonction des canapes 
    for (const color of product.colors) {
        //creation de l'element option dans le html 
        const kanapColor = document.createElement("option");
        kanapColor.innerText = color;
        select.appendChild(kanapColor);
    }

    //-- Creation de la variable pour ajout au panier --//
    const button = document.getElementById("addToCart")
    button.addEventListener('click', function () {
        //-- Variable pour créer les elements de l'id lors de l'ajout --// 
        const productChoice = {
            color: select.value,
            quantity: parseInt(document.getElementById("quantity").value), /*parseInt pour renvoyer un entier*/
            id: idProduct
        };
        submitProduct(productChoice);
    })
}
displayInfo();
//-------------------------------------- Etape 4 ------------------------//
//-- Fonction submitProduct() verfiie les informations selectionnées par l'utilisateur --//
//-- Afficher une Erreur si couleur ou qte invalide --------------------//
//----------------------------------------------------------------------//



//-- Fonction au clic du bouton Ajouter au panier --// 
function submitProduct(productChoice) {
    // -- Creation de la variable pour le local storage, permet de convertir les réponses de requetes en objets javascript --//
    let panier = JSON.parse(localStorage.getItem("panier"));

    if (productChoice.color === "") {
        alert("Veuillez choisir une couleur");
    } else if
        ((productChoice.quantity > 100) ||
        (productChoice.quantity < 1)) {
        alert("Vous devez saisir une quantité comprise entre 1 et 100");

        //-------------------------------------- Etape 5 ------------------------//
        //---Si aucune erreur creer un objet avec ID, quantité et couleur  --//
    } else { /*on verifie si le storage est vide */
        if (!panier) {
            // -- on verifie si ID et couleur ne sont pas déjà dedans --//
            panier = [];
            panier.push(productChoice);
            alert("Votre article a bien été ajouté dans votre panier")
            // -- Permet d enregistrer les données pour etre lu ulterieurement et envoyer dans le localstorage --//
            localStorage.setItem("panier", JSON.stringify(panier))
        } else {
            // créer une variable de recherche
            let isNewItem = true;
            //-- pour chaque element dans le panier si deja présent, vérifier la quantité sinon l'ajouter --//
            panier.forEach(element => {
                if (element.id === productChoice.id &&
                    element.color === productChoice.color) {
                    isNewItem = false;
                    if ((element.quantity + productChoice.quantity) > 100) {
                        alert("La quantité ne doit pas dépasser 100, veuillez modifier votre choix");
                        return;
                    } else {
                        element.quantity += productChoice.quantity;
                        alert("Votre article a bien été ajouté dans votre panier")
                        localStorage.setItem("panier", JSON.stringify(panier))
                    }
                }
            })
            //-- Si nouveau canapé, l'ajouter auu localstorage--//
            if (isNewItem) {
                panier.push(productChoice);
                alert("Votre article a bien été ajouté dans votre panier")
                localStorage.setItem("panier", JSON.stringify(panier))
            }
        }
    }
}



