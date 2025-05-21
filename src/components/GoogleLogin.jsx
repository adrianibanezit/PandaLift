// src/components/GoogleLogin.jsx
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../lib/firebase"; // asegúrate de exportar `app` en firebase.ts

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado con Google:", user);
      // Aquí puedes redirigir o guardar en Firestore si es nuevo
    } catch (error) {
      console.error("Error en el login con Google", error);
    }
  };
}
