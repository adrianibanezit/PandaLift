import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { app } from '../lib/firebase';

import styles from "../modules/SignupExtra.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const methods = await fetchSignInMethodsForEmail(auth, user.email);

    // Si solo devuelve google.com y acaba de crearse, lo redirigimos al signup
    if (methods.length === 1 && methods[0] === "google.com" && result._tokenResponse.isNewUser) {
      window.location.href = '/signup';
    } else {
      // Ya estaba registrado → dashboard
      window.location.href = '/dashboard';
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

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Contraseña</label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Entrar
      </button>

      <div className="mt-4 text-center">
        <p className="mb-2 text-gray-600">O entra con:</p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Google
        </button>
      </div>
    </form>
  );
}
