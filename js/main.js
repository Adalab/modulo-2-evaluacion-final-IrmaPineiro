"use strict"

/*Pasos en humano:
-Si la usuaria introduce un valor y hace click en buscar: 
  -mostrar el contenido del api;
    -mostrar el contenido del api que coincida con el valor introducido;
    -para mostrar el contenido del api que coincida con el valor introducido, se debe hacer una petición al servidor;
        -la petición al servidor se hace a través de un fetch.
-Si la usuaria no introduce un valor:

*/


const searchBtn = document.querySelector(".js-searchBtn");
const resetBtn = document.querySelector(".js-resetBtn");
const searchText = document.querySelector(".js-searchText");
const list = document.querySelector(".js-list");


function handleClick(event) {
    event.preventDefault();
    const value = searchText.value.toLowerCase(); //Obtener el texto del input.  --> Value se usa en fetch-->web.
    console.log(value);
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
            console.log(serialAnime);

            //Guardar en localStorage:
            localStorage.setItem("animeSeries", JSON.stringify(serialAnime));

            //Limpiar la lista antes de agregar nuevos elementos:
            list.innerHTML = "";

            //Buble para recorrer el array de objetos y acceder al titulo y a la imagen:
            for (const serial of serialAnime) {
                const title = serial.title;
                const image = serial.images.webp.image_url;
                list.innerHTML +=
                    `<li>
                    <h4>${title}</h4>
                    <img src="${image}" alt="${title}">
                </li>`
            }

        })



}
searchBtn.addEventListener("click", handleClick)

/*function handleReset(event) {
    event.preventDefault();
    searchText.reset();

}
resetBtn.addEventListener("click", handleReset)
*/


