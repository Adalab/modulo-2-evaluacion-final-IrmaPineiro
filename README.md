# **Aplicación Web de Búsqueda de Series Anime**

## **Descripción**

Esta aplicación web permite buscar series de anime utilizando una API pública y organizar los resultados en listas de búsqueda y favoritos.
Los favoritos se almacenan tanto en la lista visual como en el `localStorage`, pero pueden ser eliminados mediante el botón **Reset**.

---

## **Cómo iniciar el proyecto**

1. Clonar este repositorio en tu ordenador.
2. Abrir el archivo `index.html` usando **Live Server**.
3. Comenzar a usar la aplicación desde el navegador.

---

## **Características principales**

- **Buscador**:
  - Contiene un campo para ingresar el nombre de la serie y un botón **Buscar**.
- **Lista de resultados**:
  - Muestra los resultados de la búsqueda con el título e imagen de cada serie.
  - Si una serie no tiene imagen, se reemplaza con una imagen de relleno.
  -
- **Agregar a favoritos**:
  - Al hacer clic en un resultado, este se añade a la lista de favoritos.
  - La lista de favoritos se muestra en el lado izquierdo.
  - Los favoritos se almacenan en el `localStorage` y permanecen incluso tras recargar la página.
  -
- **Eliminar favoritos**:
  - Botón **Reset** que elimina todas las listas (resultados y favoritos) y limpia el `localStorage`.

---

## **Estructura de la aplicación**

- **Buscador de series**:
  - Formulario con un campo de texto y dos botones:
    - **Buscar**: Busca series en la API.
    - **Reset**: Limpia todas las listas y el almacenamiento.
    -
- **Lista de resultados**:
  - Muestra las series obtenidas de la búsqueda.
  -
- **Lista de favoritos**:
  - Muestra las series favoritas que has seleccionado.
