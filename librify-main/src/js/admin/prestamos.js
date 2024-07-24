import { obtenerPrestamo, eliminarPrestamo, obtenerPrestamoPorId, obtenerLibroPorId, obtenerUsuarioPorId, obtenerUsuario2 } from "../../firebase.js"

let id = 0

document.addEventListener('DOMContentLoaded', async () => {
    const prestamos = await obtenerPrestamo();
    let tabla = '';

    for (const doc of prestamos) {
        try {
            const item = doc;
            const libros = await obtenerLibroPorId(item.libroId);
            const usuarios = await obtenerUsuarioPorId(item.userId);

            const fecha = new Date(item.fecha);

            // Obtener componentes de la fecha
            const dia = fecha.getDate().toString().padStart(2, '0'); // Obtener día del mes (con padding a dos dígitos)
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Obtener mes (los meses empiezan desde 0 en JavaScript)
            const anio = fecha.getFullYear().toString(); // Obtener año

            // Formato deseado: DD/MM/YYYY (por ejemplo)
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            // Construir la tabla con los datos obtenidos
            tabla += `<tr>
                    <td>${item.cantidad}</td>
                    <td>${fechaFormateada}</td>
                    <td>${libros.data().titulo}</td>
                    <td>${usuarios.data().email}</td>
                    <td nowrap>
                        <button class="btn btn-danger" id="${item.id}">Eliminar</button>
                    </td>
                </tr>`;
        } catch (error) {
            console.error('Error al procesar préstamo:', error);
            // Manejo de errores según sea necesario
        }
    }
    document.getElementById('contenido').innerHTML = tabla

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
                    eliminarPrestamo(btn.id)
                    Swal.fire({
                        title: "Eliminado",
                        text: "Su registro ha sido eliminado",
                        icon: "success"
                    })
                }
            })
        })
    })
})
