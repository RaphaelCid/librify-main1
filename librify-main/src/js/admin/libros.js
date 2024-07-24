import { agregarLibro, obtenerLibros, eliminarLibro, obtenerLibroPorId, actualizarLibro, uploadImage } from "../../firebase.js";

let id = 0;

document.getElementById('btn-enviarlibro').addEventListener('click', async () => {
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id);
    });

    if (document.querySelectorAll('.is-invalid').length == 0) {
        const file = document.getElementById('imagen').files[0];
        if (!file) {
            alert("Debe seleccionar una imagen");
            return;
        }

        const imageUrl = await uploadImage(file);

        const libro = {
            'titulo': document.getElementById('titulo').value.trim(),
            'autor': document.getElementById('autor').value.trim(),
            'fechaPublicacion': document.getElementById('fecha-publicacion').value,
            'imagen': imageUrl,
            'genero': document.getElementById('genero').value.trim(),
            'precio': document.getElementById('precio').value,
            'cantidad': document.getElementById('cantidad').value
        };

        if (document.getElementById('btn-enviarlibro').value == 'Enviar') {
            agregarLibro(libro);
            limpiarLibro();
        } else {
            actualizarLibro(id, libro);
            limpiarLibro();
            id = 0;
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    obtenerLibros((collection) => {
        let tabla = '';
        collection.forEach((doc) => {
            const item = doc.data();
            console.log(item)
            tabla += `<tr>
                <td>${item.titulo}</td>
                <td>${item.autor}</td>
                <td>${item.fechaPublicacion}</td>
                <td><img src="${item.imagen}" alt="Imagen del libro" style="max-height: 50px;"></td>
                <td>${item.genero}</td>
                <td>${item.precio}</td>
                <td>${item.cantidad}</td>
                <td nowrap>
                    <button class="btn btn-warning" id="${doc.id}">Editar</button>
                    <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
                </td>
            </tr>`;
        });
        document.getElementById('contenido').innerHTML = tabla;

        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                Swal.fire({
                    title: "¿Estás seguro de eliminar el registro?",
                    text: "No podrás revertir los cambios",
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminarLibro(btn.id);
                        Swal.fire({
                            title: "Eliminado",
                            text: "Su registro ha sido eliminado",
                            icon: "success"
                        });
                    }
                });
            });
        });

        document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', async () => {
                const doc = await obtenerLibroPorId(btn.id);
                const d = doc.data();
                document.getElementById('titulo').value = d.titulo;
                document.getElementById('autor').value = d.autor;
                document.getElementById('fecha-publicacion').value = d.fechaPublicacion;
                document.getElementById('genero').value = d.genero;
                document.getElementById('precio').value = d.precio;
                document.getElementById('cantidad').value = d.cantidad;
                document.getElementById('btn-enviarlibro').value = 'Modificar';
                id = btn.id;
            });
        });
    });
});

function limpiarLibro() {
    document.getElementById('formulario').reset();
    document.getElementById('btn-enviarlibro').value = 'Enviar';
}
