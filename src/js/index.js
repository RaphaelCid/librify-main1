import { obtenerLibros, prestarLibro } from "../firebase.js";
import { buscarLibros } from '../firebase.js';

document.addEventListener('DOMContentLoaded', function () {
  obtenerLibros((collection) => {
    let contenido = '';
    collection.forEach((doc) => {
      const item = doc.data();
      if (item.cantidad > 0) {
        contenido += `
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div class="card h-100">
                      <img src="${item.imagen}" class="card-img-top" alt="${item.titulo}">
                      <div class="card-body">
                          <h5 class="card-title">${item.titulo}</h5>
                          <p class="card-text">Autor: ${item.autor}</p>
                          <p class="card-text">Cantidad: ${item.cantidad}</p>
                      </div>
                  </div>
              </div>
          `;
      }
    });
    document.getElementById('contenido').innerHTML = contenido;

    // Agregar evento click a cada botón
    document.querySelectorAll(".btn-prestar").forEach(btn => {
      btn.addEventListener('click', () => {
        Swal.fire({
          title: "Pedir Prestamo",
          icon: "info",
          html: `
              <div class="mb-3">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input type="email" class="form-control" id="email" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" required />
            </div>
              `,

        }).then((result) => {
          if (result.isConfirmed) {
            const libroId = btn.id;
            prestarLibro(libroId); // Llamar a la función para prestar el libro con el ID correspondiente
          }
        })
      });
    });
  });
})

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