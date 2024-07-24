import { obtenerUsuario2, eliminarUsuario, obtenerUsuarioPorId } from "../../firebase.js"

let id = 0

window.addEventListener('DOMContentLoaded', () => {
    obtenerUsuario2((collection) => {
        let tabla = ''
        collection.forEach((doc) => {
            const item = doc.data()
            const passwd = '*'.repeat(item.passwd.length); // Enmascarar la contraseña
            tabla += `<tr>
                <td>${item.email}</td>
                <td>${passwd}</td>
                <td nowrap>
                    <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
                </td>
            </tr>`
        })
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
                        eliminarUsuario(btn.id)
                        Swal.fire({
                            title: "Eliminado",
                            text: "Su registro ha sido eliminado",
                            icon: "success"
                        })
                    }
                })
            })
        })

        document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', async() => {
                const doc = await obtenerUsuarioPorId(btn.id)
                const d = doc.data()
                console.log(d.edadLectura)
                document.getElementById('nombreu').value = d.titulo
                document.getElementById('mail').value = d.autor
                document.getElementById('contraseña').value = d.fechaPublicacion
                document.getElementById('btn-enviarusuario').value = 'Modificar'
                id = btn.id
            })
        })
    })
})