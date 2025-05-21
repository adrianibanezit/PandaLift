import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '../lib/firebase'; // Ajusta ruta si es necesario

const auth = getAuth(app);
const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const userRef = doc(db, 'usuarios', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Si no existe el documento, el usuario no completó signup extra
        window.location.href = '/signup-extra';
        return;
      }

      const data = userSnap.data();

      if (!data.nombre || !data.apellidos || !data.rol) {
        // Si falta alguno de los datos
        window.location.href = '/signup-extra';
        return;
      }

      // Si está todo correcto, permanece en el dashboard
    } catch (error) {
      console.error('Error comprobando datos del usuario:', error);
      window.location.href = '/login';
    }
  });

  // Botón cerrar sesión
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
      window.location.href = '/login';
    });
  }
});
