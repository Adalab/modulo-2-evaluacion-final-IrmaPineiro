"use strict"

/*Pasos en humano:
-Si la usuaria introduce un valor y hace click en buscar: 
  -mostrar el contenido del api;
    -mostrar el contenido del api que coincida con el valor introducido;
    -para mostrar el contenido del api que coincida con el valor introducido, se debe hacer una petición al servidor;
        -la petición al servidor se hace a través de un fetch.
-Si la usuaria no introduce un valor:
    -error.

*/


const searchBtn = document.querySelector(".js-searchBtn");
const resetBtn = document.querySelector(".js-resetBtn");
const searchText = document.querySelector(".js-searchText");
const ulResultsList = document.querySelector(".js-resultsList");
const ulFavoriteList = document.querySelector(".js-favoriteList");
let resultSeries = []; //Array para guardar los elementos de la búsqueda.
let favoriteSeries = []; //Array para guardar los elementos favoritos.

/*1- Función para hacer la petición al servidor y mostrar los resultados en la lista:*/
function handleClick(event) {
    event.preventDefault();
    const value = searchText.value.trim().toLowerCase(); //Obtener el texto del input. Trim -> quitar espacios en blanco. toLowerCase -> convertir a minúsculas.
    //console.log(value);
    if (value === "") {
        alert("Introduce un valor");
        return;
    }


    //Petición al servidor:
    fetch(`https://api.jikan.moe/v4/anime?q=${value}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data); //todos los objetos de naruto de la Api.
            const serialAnime = data.data; //Array con los objetos de anime.
            //console.log(serialAnime);

            //Guardar en localStorage:
            localStorage.setItem("animeSeries", JSON.stringify(serialAnime));

            //Limpiar la lista antes de agregar nuevos elementos:
            ulResultsList.innerHTML = "";

            //Bucle para recorrer el array de objetos y acceder al titulo y a la imagen:
            for (const serial of serialAnime) {
                const title = serial.title;
                const image = serial.images.webp.image_url;
                ulResultsList.innerHTML +=
                    `<li class="resultsList-items">
                    <h4>${title}</h4>
                    <img src="${image}" alt="${title}">
                </li>`
            }
        })



    /*Función para hacer lista de favoritos (dentro del fetch, pq es donde las llama, sino, podrían no estar disponibles):
    - Si la usuaria hace click en un elemento de la lista, (hecho).
    -guardar el elemento en el array de favoriteSeries;
    -mostrar el elemento en la lista de favoritos: ulFavoriteList
    */
    //Añadir series a favoritos:
    function handleClickFavorites(event) {
        event.preventDefault();
        const clickedElement = event.target;
        console.log(clickedElement);


        favoriteSeries.push(resultSeries); //Añadir el objeto al array de favoritos.
        // console.log(favoriteSeries);

        for (const favorite of favoriteSeries) {
            let favoriteContent = "";
            favoriteContent +=
                `<li class="favoriteList-items">
                  <h4>${favorite.title}</h4>
                  <img src="${favorite.image}" alt="${favorite.title}">
                  </li>`
            ulFavoriteList.innerHTML += favoriteContent;
        }

    }

    ulFavoriteList.addEventListener("click", handleClickFavorites);


}
searchBtn.addEventListener("click", handleClick)


//Función para resetear la búsqueda:
function handleReset(event) {
    event.preventDefault();
    searchText.value = ""; //Limpiar campo de entrada.
    resultsList.innerHTML = ""; //Limpiar la lista de resultados.
}
resetBtn.addEventListener("click", handleReset)








