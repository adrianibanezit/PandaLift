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
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl flex flex-col gap-6"
    >
      <h2 className="text-2xl font-extrabold text-white mb-2 text-center tracking-tight">
        Iniciar sesión
      </h2>

      {error && (
        <div className="bg-red-600/10 border border-red-800 text-red-400 text-sm py-2 px-4 rounded mb-2 text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-slate-400 pl-1">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          className="w-full p-3 bg-[#151d32] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
          autoComplete="username"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-slate-400 pl-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-3 bg-[#151d32] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow transition text-lg"
        aria-label="Entrar"
      >
        Entrar
      </button>

      <div className="flex items-center my-2">
        <hr className="flex-1 border-slate-700" />
        <span className="mx-2 text-slate-500 text-xs">o</span>
        <hr className="flex-1 border-slate-700" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-white/10 hover:bg-white/20 border border-slate-700 text-slate-200 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow transition"
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
    </form>
  );
}
