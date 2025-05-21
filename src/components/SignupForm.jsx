import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from '../lib/firebase';

import styles from "../modules/SignupExtra.module.css";

export default function SignupForm() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rol, setRol] = useState('atleta');

  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Guarda datos adicionales en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        apellidos,
        email,
        rol,
        creadoEn: new Date()
      });

      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error al registrar:', err);
      setError('Error al registrar. Es posible que ya exista una cuenta con ese correo.');
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const methods = await fetchSignInMethodsForEmail(auth, user.email);

      if (methods.length > 0 && !result._tokenResponse.isNewUser) {
        // Ya registrado → ir al dashboard
        window.location.href = '/dashboard';
      } else {
        // Nuevo usuario → guardar datos mínimos en Firestore
        await setDoc(doc(db, 'usuarios', user.uid), {
          nombre: user.displayName || '',
          apellidos: '',
          email: user.email,
          rol: 'atleta', // valor por defecto, se podría permitir editar después
          creadoEn: new Date()
        });

        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Error con el registro de Google:', err);
      setError('No se pudo registrar con Google.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Nombre</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Apellidos</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
        />
      </div>

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

      <div className="mb-4">
        <label className="block mb-1 font-medium">Rol</label>
        <select
          className="w-full p-2 border rounded"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
        >
          <option value="atleta">Atleta</option>
          <option value="entrenador">Entrenador</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Registrarse
      </button>

      <div className="mt-4 text-center">
        <p className="mb-2 text-gray-600">O regístrate con:</p>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Google
        </button>
      </div>
    </form>
  );
}
