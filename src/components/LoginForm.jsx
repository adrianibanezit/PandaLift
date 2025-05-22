import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { app } from '../lib/firebase';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Obtener el rol desde Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      let rol = "";
      if (userDoc.exists()) {
        rol = userDoc.data().rol;
      }
      // Redirección personalizada
      if (rol === "entrenador") {
        window.location.href = "/dashboard?rol=entrenador";
      } else {
        window.location.href = "/dashboard?rol=atleta";
      }
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const methods = await fetchSignInMethodsForEmail(auth, user.email);
      if (methods.length === 1 && methods[0] === "google.com" && result._tokenResponse.isNewUser) {
        window.location.href = "/signup";
      } else {
        // Obtener el rol desde Firestore
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        let rol = "";
        if (userDoc.exists()) {
          rol = userDoc.data().rol;
        }
        if (rol === "entrenador") {
          window.location.href = "/dashboard?rol=entrenador";
        } else {
          window.location.href = "/dashboard?rol=atleta";
        }
      }
    } catch (err) {
      console.error("Error al iniciar sesión con Google", err);
      setError("No se pudo iniciar sesión con Google");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4 relative">
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          className="w-full p-3 border rounded pl-12 bg-gray-50 focus:bg-white transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Correo electrónico"
          placeholder="Correo electrónico"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6.75A2.75 2.75 0 0 1 4.75 4h14.5A2.75 2.75 0 0 1 22 6.75v10.5A2.75 2.75 0 0 1 19.25 20H4.75A2.75 2.75 0 0 1 2 17.25V6.75Zm2.75-1.25A1.25 1.25 0 0 0 3.5 6.75v.38l8.5 5.67 8.5-5.67v-.38A1.25 1.25 0 0 0 19.25 5H4.75Zm15.75 3.12-7.7 5.14a.75.75 0 0 1-.83 0L3.5 8.12v9.13c0 .69.56 1.25 1.25 1.25h14.5c.69 0 1.25-.56 1.25-1.25V8.12Z"/></svg>
        </span>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="password" className="block mb-1 font-medium">Contraseña</label>
        <input
          id="password"
          type="password"
          className="w-full p-3 border rounded pl-12 bg-gray-50 focus:bg-white transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label="Contraseña"
          placeholder="Contraseña"
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-6-6V9a6 6 0 1 1 12 0v2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm2-2v2h8V9a4 4 0 1 0-8 0Zm-2 4v6h12v-6H6Z"/></svg>
        </span>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        aria-label="Entrar"
      >
        Entrar
      </button>

      <div className="mt-4 text-center">
        <p className="mb-2 text-gray-600">O accede con:</p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2 shadow"
          aria-label="Entrar con Google"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" className="inline-block align-middle">
            <g>
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.86-6.86C36.13 2.39 30.45 0 24 0 14.82 0 6.91 5.8 2.69 14.09l7.98 6.2C12.36 13.41 17.68 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 16.09 0 19.94 0 24c0 4.06.99 7.91 2.69 12.24l7.98-6.2z"/>
              <path fill="#EA4335" d="M24 48c6.45 0 12.13-2.13 16.54-5.8l-7.19-5.59c-2.01 1.35-4.59 2.15-7.35 2.15-6.32 0-11.64-3.91-13.33-9.29l-7.98 6.2C6.91 42.2 14.82 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </g>
          </svg>
          Google
        </button>
      </div>
    </form>
  );
}
