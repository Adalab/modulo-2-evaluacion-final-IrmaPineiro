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



// Cargar favoritos desde localStorage al inicio?
const storedFavorites = JSON.parse(localStorage.getItem("favoriteSeries"));
if (storedFavorites) {
    favoriteSeriesList = storedFavorites;
    renderFavorites(favoriteSeriesList);
}


//Funcion de renderSeries. He sacado todo el HTML de fecth, y lo pongo aquí, y tengo que llamarlo en fetch.
function renderSeries(seriesData) {
    ulResultsList.innerHTML = ""; //limpiar
    //Bucle para acceder al array de objetos, y acceder al titulo y a la imagen que la usuaria ha buscado:
    for (const series of seriesData) {
        const title = series.title;
        const images = series.images.webp.image_url;
        const id = series.mal_id;
        if (images === "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png") {
            images = "https://thumbs.dreamstime.com/b/error-109026446.jpg";
        }


        //Creamos un nuevo elemento HTML para cada resultado:
        const listItemResults = `
        <li class="js-resultsListItem resultsListItem inFavorites" id=${id}>
        <h4>${title}</h4><img src="${images}" alt="${title}">
        </li>`;
        ulResultsList.innerHTML += listItemResults; //Añadir a la lista de resultados. Ahora ya se pinta lo buscado en la web. 

        //Falta hacer que resalte el borde si está en favoritos.




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
        <h4>${title}</h4><img src="${images}" alt="${title}">
        <button class="deleteBtn js-deleteBtn">x</button>
        </li>
        `;
        ulFavoriteList.innerHTML += listItemFavorite;

    }
}



//Función para el click de buscar:
function handleClick(event) {
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
searchBtn.addEventListener("click", handleClick);



//Función para favoritos:
function handleAddFavorite(event) {
    event.preventDefault();
    //console.log(event.currentTarget.id);
    const idSeriesClicked = event.currentTarget.id; //Para acceder a lo q es todo el elemento.
    //buscar la serie clickada a partir de este id:
    const seriesSelectedFav = seriesList.find((series) => {
        return String(series.mal_id) === idSeriesClicked; // Convertir mal_id a string para comparar con idSeriesClicked qu es un string. Salía undefined.
    });

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

//Función para guardar en localStorage:
function saveFavoritesToLocalStorage() {
    localStorage.setItem("favoriteSeries", JSON.stringify(favoriteSeriesList));
}



//Función para resetear la búsqueda:
function handleReset(event) {
    event.preventDefault();
    searchText.value = ""; //Limpiar campo de entrada.
    ulResultsList.innerHTML = ""; //Limpiar la lista de resultados.
    ulFavoriteList.innerHTML = ""; //Limpiar la lista de favoritos. SE BORRA PERO ESTÁ.

}
resetBtn.addEventListener("click", handleReset)

