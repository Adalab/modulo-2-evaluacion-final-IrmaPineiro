"use strict"

/*Pasos en humano:
-Si la usuaria introduce un valor: (tendría que cambiarlo a cuando la suaria hace clcik en buscar??).
  -mostrar el contenido del api;
    -mostrar el contenido del api que coincida con el valor introducido;
    -para mostrar el contenido del api que coincida con el valor introducido, se debe hacer una petición al servidor;
    -la petición al servidor se hace a través de un fetch.
-Si la usuaria no introduce un valor:

*/


const searchBtn = document.querySelector(".js-searchBtn");
const resetBtn = document.querySelector(".js-resetBtn");
const searchText = document.querySelector(".js-searchText");


function handleInput(event) {
    event.preventDefault();
    const value = searchText.value; //Obtener el texto del input.
    console.log(value);

    //Petición al servidor:
    fetch("https://api.jikan.moe/v4/anime?q=naruto")
        .then(response => response.json())
        .then(data => {
            console.log(data); //todos los objetos de naruto de la Api.
        })


    // if (localStorage)



}
searchText.addEventListener("input", handleInput)



