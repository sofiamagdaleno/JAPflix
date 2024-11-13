// Declaración de dos arrays vacíos para almacenar las películas
let movies = [];
let search_movies = [];

// Función para mostrar las películas en el HTML
function showMovies(array) {
    document.getElementById("lista").innerHTML = ""; // Limpia la lista de películas antes de mostrar nuevas
    for (const movie of array) { // Itera sobre el array de películas
        let stars = ""; // Variable para almacenar las estrellas de calificación
        // Crea las estrellas basadas en el promedio de votos (divide entre 2 para una escala de 5 estrellas)
        for (let i = 0; i < parseInt(movie.vote_average / 2); i++) {
            stars += `<span class="fa fa-star checked"></span>`; // Estrella marcada
        }
        for (let i = 0; i < (5 - parseInt(movie.vote_average / 2)); i++) {
            stars += `<span class="fa fa-star"></span>`; // Estrella vacía
        }

        let genres = ""; // Variable para almacenar los géneros
        // Itera sobre los géneros de la película y los concatena
        for (const genero of movie.genres) {
            genres += genero.name + " - "
        }
        genres = genres.slice(0, genres.length - 3) // Elimina el último separador " - "

        // Añade el contenido HTML para cada película en la lista
        document.getElementById("lista").innerHTML += `
            <li class="list-group-item bg-dark text-white"> <!-- Estilos de fondo y texto -->
                <!-- Botón que abre un panel lateral con más detalles de la película -->
                <div type="button" data-bs-toggle="offcanvas" data-bs-target="#oc${movie.id}" aria-controls="offcanvasTop">
                    <div class="fw-bold">${movie.title} <span class="float-end">${stars}</span></div> <!-- Título y estrellas -->
                    <div class="text-muted fst-italic">${movie.tagline}</div> <!-- Subtítulo (tagline) -->
                </div>
                <!-- Panel lateral con más información de la película -->
                <div class="offcanvas offcanvas-top text-dark" tabindex="-1" id="oc${movie.id}" aria-labelledby="offcanvasTopLabel">
                    <div class="offcanvas-header">
                        <h3 class="offcanvas-title" id="offcanvasTopLabel">${movie.title}</h3> <!-- Título en el panel lateral -->
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> <!-- Botón para cerrar el panel -->
                    </div>
                    <div class="offcanvas-body">
                        <p>${movie.overview}</p> <!-- Descripción de la película -->
                        <hr>
                        <span class="text-muted">
                            ${genres} <!-- Muestra los géneros de la película -->
                            <!-- Botón con más información como año, duración, presupuesto, etc. -->
                            <button class="float-end btn btn-secondary dropdown-toggle" type="button" id="dd${movie.id}" data-bs-toggle="dropdown" aria-expanded="false">More</button>
                            <ul class="dropdown-menu" aria-labelledby="dd${movie.id}">
                                <li><span class="dropdown-item">Year: <span class="float-end ps-1"> ${movie.release_date.slice(0,4)}</span></span></li> <!-- Año de lanzamiento -->
                                <li><span class="dropdown-item">Runtime: <span class="float-end ps-1"> ${movie.runtime} mins</span></span></li> <!-- Duración -->
                                <li><span class="dropdown-item">Budget: <span class="float-end ps-1"> $${movie.budget}</span></span></li> <!-- Presupuesto -->
                                <li><span class="dropdown-item">Revenue: <span class="float-end ps-1"> $${movie.revenue}</span></span></li> <!-- Ingresos -->
                            </ul>
                        </span>
                    </div>
                </div>
            </li>
            `;
    }
}

// Evento que se ejecuta cuando el contenido del documento ha cargado
document.addEventListener("DOMContentLoaded", function () {

    // Hace una petición para obtener los datos de las películas desde una API externa
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
        .then(response => response.json()) // Convierte la respuesta en formato JSON
        .then(data => {
            movies = data // Almacena las películas en la variable movies
            // Añade un evento al botón de búsqueda
            document.getElementById("btnBuscar").addEventListener("click", function () {
                search_movies = []; // Limpia los resultados de búsqueda anteriores
                // Si el campo de búsqueda tiene un valor, filtra las películas
                if (document.getElementById("inputBuscar").value) {
                    search_movies = movies.filter(movie => {
                        // Busca por título, subtítulo (tagline) o descripción (overview)
                        return movie.title.toLowerCase().includes(document.getElementById("inputBuscar").value.toLowerCase()) ||
                        movie.tagline.toLowerCase().includes(document.getElementById("inputBuscar").value.toLowerCase()) ||
                        movie.overview.toLowerCase().includes(document.getElementById("inputBuscar").value.toLowerCase())
                    });
                }
                showMovies(search_movies); // Muestra las películas filtradas
            })
        })
})
