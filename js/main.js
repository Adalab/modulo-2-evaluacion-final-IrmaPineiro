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

//Funcion de renderseries. He sacado todo el HTML de fecth, y lo pongo aquí, y tengo que llamarlo en fetch.
function renderseries(seriesData) {
    //Bucle para acceder al array de objetos, y acceder al titulo y a la imagen que la usuaria ha buscado:
    for (const series of seriesData) {
        const title = series.title;
        const images = series.images.webp.image_url;
        const id = series.mal_id;

        //Condición para cambiar imagen de error:
        if (images === "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png") {
            images = "https://thumbs.dreamstime.com/b/error-109026446.jpg";
        }

        //Creamos un nuevo elemento HTML para cada resultado:
        let listItemResults = `
        <li class="js-resultsListItem resultsListItem" id=${id}>
        <h4>${title}</h4><img src="${images}" alt="${title}">
        </li>`;
        ulResultsList.innerHTML += listItemResults; //Añadir a la lista de resultados. 
        //Ahora ya se pinta lo buscado en la web. 
        //Ahora vamos a pintar la lista de favoritos. Para esto hacemos querySelectorAll y SIEMPRE que hago un All, hacemos un bucle for-of para acceder a cada elemento del html:
        const allseriesDOM = document.querySelectorAll(".js-resultsListItem");

        //Y ahora el bucle:
        for (const seriesDOM of allseriesDOM) {
            seriesDOM.addEventListener("click", handleAddFavorite) //Para escuchar cada elemnto del addEventListener.
            //AHORA YA PUDO HACER MI LISTA DE FAVORITOS POR FUERA(debajo de esta función).
        }

    }
}



//Función para el click de buscar:
function handleClick(event) {
    event.preventDefault();
    const inputValue = searchText.value.toLowerCase();
    //console.log(inputValue);



    //Petición al servidor:
    fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data); //Todos los objetos
            const seriesAnime = data.data; //Array con los objetos de anime.
            //console.log(seriesAnime); 

            seriesList = seriesAnime; // Ahora seriesList contiene los resultados de la búsqueda.
            //console.log(seriesList);

            //Filtrar los resultados, para que solo se muestren los que coinciden con lo que se ha buscado:
            //DUDAS: 1.no estoy usando la constante filteredResults aunque sí su contenido. 2.Está bien escrito?
            const filteredResults = seriesAnime.filter(series => {
                return series.title.toLowerCase().includes(inputValue);
            });

            //Limpiar la lista. Antes de mostrar nuevos, borramos antiguos: 
            ulResultsList.innerHTML = "";

            //Me he llevado lo que pinta el HTML a la función renderseries, ahora la tengo que nombrar aquí y renderseries llama a serielAnime, que es el valor real:

            renderseries(seriesList);

        })


}
searchBtn.addEventListener("click", handleClick);



//Función para favoritos:
function handleAddFavorite(event) {
    event.preventDefault();
    //console.log(event.currentTarget.id);
    const idSeriesClicked = event.currentTarget.id; //Para acceder a lo q es todo el elemento.
    //console.log(event.currentTarget.id);

    //buscar la serie clickada a partir de este id:
    const seriesSelected = seriesList.find((series) => {
        return String(series.mal_id) === idSeriesClicked; // Convertir mal_id a string para comparar con idSeriesClicked qu es un string. Salía undefined.

    })
    //console.log(seriesSelected);

    //Añadir esa serie clickada a la lista de series favoritas:
    favoriteSeriesList.push(seriesSelected);
    console.log(favoriteSeriesList);

    //Pintar las series en favoritos:
    //1.Limpiar la lista. Antes de mostrar nuevos, borramos antiguos: 
    //2.Pintar (copiando el html de arriba):
    ulFavoriteList.innerHTML = "";
    for (const series of favoriteSeriesList) {
        const title = series.title;
        const images = series.images.webp.image_url;
        const id = series.mal_id;
        //Creamos un nuevo elemento HTML para cada resultado:
        let listItemFavorite = `
        <li class="js-favoriteListItem favoriteListItem" id=${id}>
        <h4>${title}</h4><img src="${images}" alt="${title}">
        </li>`;
        ulFavoriteList.innerHTML += listItemFavorite;
        //Añadir a la lista de resultados. 
        //Ahora ya se pinta lo buscado en la web. 
    }


}


//Función para resetear la búsqueda:
function handleReset(event) {
    event.preventDefault();
    searchText.value = ""; //Limpiar campo de entrada.
    ulResultsList.innerHTML = ""; //Limpiar la lista de resultados.
    ulFavoriteList.innerHTML = ""; //Limpiar la lista de favoritos.
}
resetBtn.addEventListener("click", handleReset)


