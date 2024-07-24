import { obtenerLibros, prestarLibro } from '../../firebase.js';
import { buscarLibros } from '../../firebase.js';

document.addEventListener('DOMContentLoaded', function() {
    obtenerLibros((collection) => {
        let contenido = '';
        collection.forEach((doc) => {
            const item = doc.data();
            contenido += `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                        <img src="${item.imagen}" class="card-img-top" alt="${item.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${item.titulo}</h5>
                            <p class="card-text">Autor: ${item.autor}</p>
                            <p class="card-text">Cantidad: ${item.cantidad}</p>
                            <div class="libro" id="libro_${doc.id}">
                                <button class="btn btn-primary btn-prestar" id="${doc.id}">Pedir Prestado</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById('contenido').innerHTML = contenido;

        // Agregar evento click a cada botón
        document.querySelectorAll(".btn-prestar").forEach(btn => {
            btn.addEventListener('click', function() {
                const libroId = btn.id;
                prestarLibro(libroId); // Llamar a la función para prestar el libro con el ID correspondiente
            });
        });
    });
});
document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const terminoBusqueda = document.getElementById('searchInput').value;
    const libros = await buscarLibros(terminoBusqueda);
    mostrarLibros(libros);
  });
  
  const mostrarLibros = (libros) => {
    const contenidoDiv = document.getElementById('contenido');
    contenidoDiv.innerHTML = '';
    libros.forEach((libro) => {
      const libroDiv = document.createElement('div');
      libroDiv.classList.add('col-md-4');
      libroDiv.innerHTML = `
                      <div class="card mb-4 shadow-sm">
                          <div class="card-body">
                              <img src="${libro.imagen}" class="card-img-top" alt="${libro.titulo}">
                              <h5 class="card-title">${libro.titulo}</h5>
                              <p class="card-text">Autor: ${libro.autor}</p>
                              <p class="card-text">Cantidad: ${libro.cantidad}</p>
                          </div>
                      </div>
                  `;
      contenidoDiv.appendChild(libroDiv);
    });
  }