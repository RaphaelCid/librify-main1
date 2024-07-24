import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { doc, query, where, collection, deleteDoc, getDoc, getDocs, onSnapshot, getFirestore, updateDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXrVR4494DPu26hbjLhHCfHgUf5r0Pbsw",
    authDomain: "librify-e50da.firebaseapp.com",
    projectId: "librify-e50da",
    storageBucket: "librify-e50da.appspot.com",
    messagingSenderId: "699128670345",
    appId: "1:699128670345:web:d9f4e5253a5c3d39193e58"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export const agregarLibro = async (libro) => {
    await addDoc(collection(db, 'libros'), libro);
    return true;
};

export const obtenerLibros = async (libro) => {
    onSnapshot(collection(db, 'libros'), libro);
};

export const eliminarLibro = async (id) => {
    await deleteDoc(doc(db, 'libros', id));
    return true;
};

export const obtenerLibroPorId = async (id) => {
    return getDoc(doc(db, 'libros', id));
};

export const actualizarLibro = async (id, libro) => {
    await updateDoc(doc(db, 'libros', id), libro);
    return true;
};

export const prestarLibro = async (libroId) => {
    const userId = localStorage.getItem("userId")
    try {
        // Obtener la referencia al documento del libro
        const libroRef = doc(db, 'libros', libroId);
        const libroSnap = await getDoc(libroRef);

        if (libroSnap.exists()) {
            const libroData = libroSnap.data();

            // Comprobar si hay suficientes libros disponibles
            if (libroData.cantidad > 0) {
                // Crear el documento de préstamo
                const prestamoRef = doc(db, 'prestamos', `${userId}_${libroId}`);
                console.log(prestamoRef)
                await setDoc(prestamoRef, {
                    userId,
                    libroId,
                    cantidad: 1,
                    fecha: new Date().toISOString()
                });

                // Actualizar la cantidad de libros
                await updateDoc(libroRef, {
                    cantidad: libroData.cantidad - 1
                });

                alert('Préstamo realizado con éxito');
            } else {
                alert('No hay suficientes libros disponibles');
            }
        } else {
            alert('Libro no encontrado');
        }
    } catch (error) {
        console.error('Error al pedir prestado el libro:', error);
        alert('Error al realizar el préstamo');
    }
}

export const agregarUsuario = async (usuario) => {
    const xd = await addDoc(collection(db, 'usuarios'), usuario);
    if(xd) {
        return true;
    }
    return false
};

export const obtenerUsuario2 = async (usuario) => {
    onSnapshot(collection(db, 'usuarios'), usuario);
};

const obtenerUsuario = async (usuario) => {
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('email', '==', usuario.email)); // Convertimos a minúsculas para hacer la búsqueda

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs)
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data(); // Retorna los datos del primer documento encontrado
    } else {
        return false
    }
};

export const registerUsuario = async (usuario) => {
    try {
        // Verificar si el usuario ya existe antes de agregarlo (opcional, depende de tu lógica)
        const existeUsuario = await obtenerUsuario({ email: usuario.email, passwd: usuario.passwd });
        if (existeUsuario) {
            throw new Error('El usuario ya está registrado');
        }

        // Agregar el usuario a Firestore
        const usuariosRef = collection(db, 'usuarios');
        const newUser = {
            email: usuario.email,
            passwd: usuario.passwd // Asegúrate de manejar esto de forma segura en tu aplicación real
        };
        const docRef = await addDoc(usuariosRef, newUser);

        console.log('Usuario registrado con ID:', docRef.id);
        localStorage.setItem("userId", docRef.id)
        return docRef.id; // Retornar el ID del nuevo documento creado
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error; // Propagar el error para manejarlo en la función llamadora
    }
};

export const loginUsuario = async (usuario) => { 
    try {
        // Obtener el usuario de Firestore
        const userDoc = await obtenerUsuario({ email: usuario.email, passwd: usuario.passwd });

        if (usuario.email === "admin@gmail.com" && usuario.passwd === "admin") {
            console.log('Admin autenticado: ID = admin');
            return "admin";
        }

        if (userDoc) {
            // Suponiendo que `obtenerUsuario` devuelve un objeto con los datos del usuario y la referencia del documento
            // Si necesitas la ID del documento específico:
            
            const usuariosRef = collection(db, 'usuarios');
            const q = query(usuariosRef, where('email', '==', usuario.email), where('passwd', '==', usuario.passwd));
            const querySnapshot = await getDocs(q);
            const userId = querySnapshot.docs[0].id; // Obtener la ID del documento
            localStorage.setItem("userId", userId);
            return true;
        } else {
            throw new Error('Credenciales inválidas'); // Manejar el caso donde las credenciales son incorrectas
        }
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        throw error; // Propagar el error para manejarlo en la función llamadora
    }
}; 


export const eliminarUsuario = async (id) => {
    await deleteDoc(doc(db, 'usuarios', id));
    return true;
};


export const obtenerPrestamo = async () => {
    try {
        const prestamosRef = collection(db, 'prestamos');
        const prestamosSnapshot = await getDocs(prestamosRef);
        
        const prestamosList = prestamosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return prestamosList;
    } catch (error) {
        console.error('Error al obtener los préstamos:', error);
        throw new Error('Error al obtener los préstamos');
    }
};

export const eliminarPrestamo = async (id) => {
    await deleteDoc(doc(db, 'prestamos', id));
    return true;
};

export const obtenerUsuarioPorId = async (id) => {
    return getDoc(doc(db, 'usuarios', id));
};

export const obtenerPrestamoPorId = async (id) => {
    return getDoc(doc(db, 'prestamo', id));
};

export const actualizarUsuario = async (id, usuario) => {
    await updateDoc(doc(db, 'usuarios', id), usuario);
    return true;
};

export const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
};
export const buscarLibros = async (terminoBusqueda) => {
    const librosRef = collection(db, 'libros');
    const q = query(
        librosRef,
        where('titulo', '>=', terminoBusqueda),
        where('titulo', '<=', terminoBusqueda + '\uf8ff')
    );
    
    const q2 = query(
        librosRef,
        where('autor', '>=', terminoBusqueda),
        where('autor', '<=', terminoBusqueda + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    
    const libros = [];
    
    querySnapshot.forEach((doc) => {
        libros.push({ id: doc.id, ...doc.data() });
    });

    querySnapshot2.forEach((doc) => {
        libros.push({ id: doc.id, ...doc.data() });
    });

    return libros;
};
