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

export default function SignupForm() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rol, setRol] = useState('atleta');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [certificaciones, setCertificaciones] = useState('');
  const [especialidades, setEspecialidades] = useState('');

  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      // Datos adicionales según el rol
      let extra = {};
      if (rol === 'atleta') {
        extra = {
          edad,
          peso,
          altura,
          experiencia,
        };
      } else if (rol === 'entrenador') {
        extra = {
          certificaciones,
          especialidades,
          experiencia,
        };
      }
      await setDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        apellidos,
        email,
        rol,
        creadoEn: new Date(),
        ...extra
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md" aria-label="Formulario de registro">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="nombre" className="block mb-1 font-medium">Nombre</label>
        <input
          id="nombre"
          type="text"
          className="w-full p-2 border rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          aria-label="Nombre"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="apellidos" className="block mb-1 font-medium">Apellidos</label>
        <input
          id="apellidos"
          type="text"
          className="w-full p-2 border rounded"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
          aria-label="Apellidos"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Correo electrónico"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-medium">Contraseña</label>
        <input
          id="password"
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label="Contraseña"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rol" className="block mb-1 font-medium">Rol</label>
        <select
          id="rol"
          className="w-full p-2 border rounded"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
          aria-label="Rol"
        >
          <option value="atleta">Atleta</option>
          <option value="entrenador">Entrenador</option>
        </select>
      </div>

      {/* Campos adicionales según el rol */}
      {rol === 'atleta' && (
        <>
          <div className="mb-4">
            <label htmlFor="edad" className="block mb-1 font-medium">Edad</label>
            <input
              id="edad"
              type="number"
              className="w-full p-2 border rounded"
              value={edad}
              onChange={e => setEdad(e.target.value)}
              min="10"
              max="100"
              aria-label="Edad"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="peso" className="block mb-1 font-medium">Peso (kg)</label>
            <input
              id="peso"
              type="number"
              className="w-full p-2 border rounded"
              value={peso}
              onChange={e => setPeso(e.target.value)}
              min="20"
              max="300"
              aria-label="Peso"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="altura" className="block mb-1 font-medium">Altura (cm)</label>
            <input
              id="altura"
              type="number"
              className="w-full p-2 border rounded"
              value={altura}
              onChange={e => setAltura(e.target.value)}
              min="100"
              max="250"
              aria-label="Altura"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="experiencia" className="block mb-1 font-medium">Nivel de experiencia</label>
            <input
              id="experiencia"
              type="text"
              className="w-full p-2 border rounded"
              value={experiencia}
              onChange={e => setExperiencia(e.target.value)}
              aria-label="Nivel de experiencia"
            />
          </div>
        </>
      )}
      {rol === 'entrenador' && (
        <>
          <div className="mb-4">
            <label htmlFor="certificaciones" className="block mb-1 font-medium">Certificaciones</label>
            <input
              id="certificaciones"
              type="text"
              className="w-full p-2 border rounded"
              value={certificaciones}
              onChange={e => setCertificaciones(e.target.value)}
              aria-label="Certificaciones"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="especialidades" className="block mb-1 font-medium">Especialidades</label>
            <input
              id="especialidades"
              type="text"
              className="w-full p-2 border rounded"
              value={especialidades}
              onChange={e => setEspecialidades(e.target.value)}
              aria-label="Especialidades"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="experiencia" className="block mb-1 font-medium">Años de experiencia</label>
            <input
              id="experiencia"
              type="text"
              className="w-full p-2 border rounded"
              value={experiencia}
              onChange={e => setExperiencia(e.target.value)}
              aria-label="Años de experiencia"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        aria-label="Registrarse"
      >
        Registrarse
      </button>

      <div className="mt-4 text-center">
        <p className="mb-2 text-gray-600">O regístrate con:</p>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2 shadow"
          aria-label="Registrarse con Google"
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
