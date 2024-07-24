import { loginUsuario, registerUsuario } from "../../firebase.js"

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-login-register');
    const toggleLink = document.getElementById('toggle-link');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    let isLogin = true;

    toggleLink.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            formTitle.textContent = 'Iniciar Sesión';
            submitButton.textContent = 'Ingresar';
            toggleLink.textContent = '¿No tienes una cuenta? Regístrate';
        } else {
            formTitle.textContent = 'Registrarse';
            submitButton.textContent = 'Registrarse';
            toggleLink.textContent = '¿Ya tienes una cuenta? Inicia sesión';
        }
    });

    // Evento click del botón submit (Ingresar o Registrar)
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const btnLogin = submitButton; // Usamos la variable submitButton ya obtenida
        const email = document.getElementById("email").value;
        const passwd = document.getElementById("password").value;

        if (btnLogin.textContent === "Ingresar") {
            // Lógica para autenticación (loginUsuario)
            try {
                const user = {
                    email: email,
                    passwd: passwd
                };
                const usuario = await loginUsuario(user); // Llama a la función para autenticar al usuario
                if(usuario === "admin"){
                    window.location.href = "../indexAdmin.html"
                    return
                }
                if(usuario){
                    Swal.fire({
                        title: "Logeado Completado",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "../indexUsuario.html"
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Error",
                        icon: "error",
                    })
                }
            } catch (error) {
                console.error('Error al autenticar usuario:', error);
                // Maneja el error, por ejemplo, muestra un mensaje al usuario
            }
        } else if (btnLogin.textContent === "Registrarse") {
            console.log('Intentando registrar usuario...'); // Agregamos un console.log para depuración

            // Lógica para registro (registerUsuario)
            try {
                const user = {
                    email: email,
                    passwd: passwd
                };

                const userId = await registerUsuario(user); // Llama a la función para registrar al usuario

                // Maneja el usuario registrado según tu lógica
                if(userId){
                    Swal.fire({
                        title: "Registro Completado",
                        icon: "success",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "../indexUsuario.html"
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Error",
                        icon: "Error",
                    })
                }
                // Por ejemplo, redirecciona a otra página o muestra un mensaje de éxito

            } catch (error) {
                console.error('Error al registrar usuario:', error);
                // Maneja el error, por ejemplo, muestra un mensaje al usuario
            }
        }
    });
});