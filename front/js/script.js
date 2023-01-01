
//Recuperation des éléments de l'APi

//on créer une fonction que l'on décide d'appeler getProduct pour récupéré la liste des produits
//fonction async : permet d'attendre sa réponse, car le javascript est un language qui fait tout en même temps
async function getProducts() {
    //on récupére les données de l'API via un fetch, le await, permet d'attendre sa réponse, sinon ont aura une promesse de répons et non pas les infos
    let response = await fetch("http://localhost:3000/api/products");
    //on test si la variable ok présente avec fetch est égale a True, ce qui veut dire que la requete n'a pas eu d'erreur
    if (response.ok) {
        //on retourne alors le résultat en json
        return response.json();
    } else {
        //si ok = false, il y'a une erreur, donc ont affiche dans le log ses détails
        console.log(response.error);
    }
}

//on créer une seconde fonction, qui va servir a afficher les produits sur la page
async function displayProduct() {
    //on appele la fonction getProducts, et on enregistre son resultat dans une fonction que l'on crée
    let products = await getProducts();
    //on récupére la section qui va accueillir nos produits
    const section = document.getElementById("items");
    //on créer un fragment, c'est un balise HTML invisible
    const fragment = document.createDocumentFragment();
    //pour chaque produits dans la liste on va réalisé une action
    products.forEach(product => {
        //on créer une balise <a> qu'on enregistre dans une variable
        const lien = document.createElement("a")
        //on paramèttre la balise <a> en lui rajoutant le href
        lien.href = `./product.html?id=${product._id}`
        //on rajoute le reste du code HTML enfant de la balse <a>
        lien.innerHTML = `<article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>`;
        //on rajoute la balise <a> dans le fragment
        fragment.appendChild(lien);
    });
    //on affiche le fragment dans la section une fois que le foreach est fini pour avoir la version finale 
    section.appendChild(fragment);
}

// on appelle la fonction pour qu'elle fasse son travail
displayProduct();
