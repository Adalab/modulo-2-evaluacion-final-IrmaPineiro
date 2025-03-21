"use strict"
/*   */

/* Pasos en humano:
-Cuando la usuaria haga click en buscar, (hecho).
     -conectar con la Api:
    -recoger el texto que la usuaria ha introducido y conectarlo con la  Api. --> hacer petición al servidor.
    -devolver lo que conincide 
          -pintar imagen y titulo.
    -Si la serie buscada, no tiene imagen, devolver imagen de relleno.
    -Si la usuaria no introduce un valor:
    -error.  

 */

const searchBtn = document.querySelector(".js-searchBtn");
const resetBtn = document.querySelector(".js-resetBtn");
const searchText = document.querySelector(".js-searchText");
const ulResultsList = document.querySelector(".js-resultsList");
const ulFavoriteList = document.querySelector(".js-favoriteList");
let seriesList = []; //Estará vacía, hasta q se cargue con la busqueda.
let favoriteSeriesList = [];  //Estará vacía, hasta q la usuaria vaya llenando.




// Cargar favoritos desde localStorage al inicio.
const storedFavorites = JSON.parse(localStorage.getItem("favoriteSeries")); //Ahora se convierte en un array.
if (storedFavorites) {
    favoriteSeriesList = storedFavorites;
    renderFavorites(favoriteSeriesList); //llamamos a renderFavorites para pintar las imagenes en html.
}


//Funcion de renderSeries. He sacado todo el HTML de fecth, y lo pongo aquí, y tengo que llamarlo en fetch.
function renderSeries(seriesData) {
    ulResultsList.innerHTML = ""; //limpiar
    //Bucle para acceder al array de objetos, y acceder al titulo y a la imagen que la usuaria ha buscado:
    for (const series of seriesData) {
        const title = series.title;
        let images = series.images.webp.image_url;
        const id = series.mal_id;
        if (images === "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png") {
            images = "https://thumbs.dreamstime.com/b/error-109026446.jpg";
        }


        //Creamos un nuevo elemento HTML para cada resultado:
        const resultListItem = `
        <li class="js-resultsListItem resultsListItem" id=${id}>
        <h4>${title}</h4><img src="${images}" alt="${title}">
        </li>`;
        ulResultsList.innerHTML += resultListItem; //Añadir a la lista de resultados. Ahora ya se pinta lo buscado en la web. 


        //Ahora vamos a pintar la lista de favoritos. Para esto hacemos querySelectorAll y SIEMPRE que hago un All, hacemos un bucle for-of para acceder a cada elemento del html:
        const allseriesDOM = document.querySelectorAll(".js-resultsListItem");
        //Y ahora el bucle:
        for (const seriesDOM of allseriesDOM) {
            seriesDOM.addEventListener("click", handleAddFavorite) //Para escuchar cada elemnto del addEventListener.
            //AHORA YA PUDO HACER MI LISTA DE FAVORITOS POR FUERA(debajo de esta función).
        }

    }
}

//Función para pintar favoritos:
function renderFavorites(favoriteSeriesList) {
    ulFavoriteList.innerHTML = "";
    for (const favorite of favoriteSeriesList) {
        const title = favorite.title;
        const images = favorite.images.webp.image_url;
        const id = favorite.mal_id;
        //Creamos un nuevo elemento HTML para cada resultado:
        const listItemFavorite = `
        <li class="js-favoriteListItem favoriteListItem" id=${id}>
        <button class="deleteBtn js-deleteBtn" id="${id}">x</button>
        <h4>${title}</h4><img src="${images}" alt="${title}">
        </li>
        `;
        ulFavoriteList.innerHTML += listItemFavorite;
    }

    //Asignar el listener justo despues de crear el botón, sino, no funciona:
    const allDeleteButtons = document.querySelectorAll(".js-deleteBtn");
    //console.log(allDeleteButtons);
    //Y ahora el bucle:
    for (const deleteBton of allDeleteButtons) {
        deleteBton.addEventListener("click", handleDeleteClick) //Para escuchar cada elemento del addEventListener.
    }

}

//Función para eliminar favoritos:
function handleDeleteClick(event) {
    event.preventDefault();
    //console.log("Botón de eliminar clicado con ID:", event.currentTarget.id);
    const deleteSeriesId = event.currentTarget.id; //para acceder al elemento por el Id.
    //console.log("antes de eliminar:", favoriteSeriesList);
    //console.log("id a eliminar:", deleteSeriesId);

    favoriteSeriesList = favoriteSeriesList.filter( //filter para crear nuevo array sin el seleccionado.
        (series) => String(series.mal_id) !== deleteSeriesId); //Convertir mal_id a string (pq es un numero).
    saveFavoritesToLocalStorage(); //Actualizar LocalStorage;
    renderFavorites(favoriteSeriesList); //Volver a renderizar favoritos.
}
//console.log("Despues de elimnar", favoriteSeriesList);
/* Cuando la usuaria hace click en eliminar,
          -obtener el id del elemento que se ha clickado,
          y cuando tenga el Id en mi array de favoritos: let favoriteSeriesList = []; 
          -eliminar el objeto del array --> filter.
          -cuando tenga el objeto del array --> lo pinto de nuevo: renderFavorites(favoriteSeriesList);
         */


//Función para el click de buscar:
function handleSearchClick(event) {
    event.preventDefault();
    const inputValue = searchText.value.toLowerCase();

    //Petición al servidor:
    fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data); //Todos los objetos
            seriesList = data.data; //Array con los objetos de anime.
            renderSeries(seriesList);
        })


}
searchBtn.addEventListener("click", handleSearchClick);



//Función para añadir favoritos:
function handleAddFavorite(event) {
    event.preventDefault();
    //console.log(event.currentTarget.id);
    const idSeriesClicked = event.currentTarget.id; //Para acceder a lo q es todo el elemento.
    //buscar la serie clickada a partir de este id:
    const seriesSelectedFav = seriesList.find((series) => {
        return String(series.mal_id) === idSeriesClicked; // Convertir mal_id a string (pq es un numero) para comparar con idSeriesClicked qu es un string. Salía undefined.
    });
    //condición por si la serie ya está o no en favoritos:
    if (seriesSelectedFav) {
        const alreadyFavorite = favoriteSeriesList.find(favorite => favorite.mal_id === seriesSelectedFav.mal_id);
        if (!alreadyFavorite) {
            favoriteSeriesList.push(seriesSelectedFav);
            saveFavoritesToLocalStorage();
            renderFavorites(favoriteSeriesList)
        } else {
            alert("Esta serie ya está en favoritos");
        }
    }

}




//Función para guardar en localStorage. Si la saco fuera de la otra función es más acceisble.
function saveFavoritesToLocalStorage() {
    localStorage.setItem("favoriteSeries", JSON.stringify(favoriteSeriesList));
}




//Función para resetear la búsqueda:
function handleReset(event) {
    event.preventDefault();
    searchText.value = ""; //Limpiar campo de entrada.
    ulResultsList.innerHTML = ""; //Limpiar la lista de resultados.
    ulFavoriteList.innerHTML = ""; //Limpiar la lista de favoritos. SE BORRA PERO ESTÁ.
    localStorage.removeItem("favoriteSeries"); //Ahora se borra lo de localStorage.
    localStorage.clear();
    favoriteSeriesList = [];
    seriesList = [];
}
resetBtn.addEventListener("click", handleReset)














