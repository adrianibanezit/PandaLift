import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../lib/firebase";

import styles from "../modules/SignupExtra.module.css";

export default function SignupExtra() {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("atleta");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [certificaciones, setCertificaciones] = useState("");
  const [especialidades, setEspecialidades] = useState("");

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
        return;
      }
      if (!isMounted) return;

      setUser(currentUser);

      try {
        const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setNombre(data.nombre || "");
          setApellidos(data.apellidos || "");
          setEmail(data.email || "");
          setRol(data.rol || "atleta");
        }
      } catch (err) {
        console.error("Error al cargar datos de usuario:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !apellidos.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      let extra = {};
      if (rol === "atleta") {
        extra = {
          edad,
          peso,
          altura,
          experiencia,
        };
      } else if (rol === "entrenador") {
        extra = {
          certificaciones,
          especialidades,
          experiencia,
        };
      }
      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          email,
          rol,
          creadoEn: new Date(),
          ...extra
        },
        { merge: true }
      );
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Hubo un error al guardar los datos.");
    }
  };

  if (loading) {
    return <p className={styles.error}>Cargando...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} aria-label="Formulario de perfil extra">
      <h2 className={styles.title}>Completa tu perfil</h2>

      {error && <p className={styles.error}>{error}</p>}

      <label htmlFor="nombre" className={styles.label}>Nombre</label>
      <input
        id="nombre"
        type="text"
        className={styles.inputField}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        aria-label="Nombre"
      />

      <label htmlFor="apellidos" className={styles.label}>Apellidos</label>
      <input
        id="apellidos"
        type="text"
        className={styles.inputField}
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
        required
        aria-label="Apellidos"
      />

      <label htmlFor="email" className={styles.label}>Email</label>
      <input
        id="email"
        type="email"
        className={styles.inputField}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        readOnly
        aria-readonly="true"
        aria-label="Correo electrónico"
      />

      <label htmlFor="rol" className={styles.label}>Rol</label>
      <select
        id="rol"
        className={styles.selectField}
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        required
        aria-label="Rol"
      >
        <option value="atleta">Atleta</option>
        <option value="entrenador">Entrenador</option>
      </select>

      {/* Campos adicionales según el rol */}
      {rol === "atleta" && (
        <>
          <label htmlFor="edad" className={styles.label}>Edad</label>
          <input
            id="edad"
            type="number"
            className={styles.inputField}
            value={edad}
            onChange={e => setEdad(e.target.value)}
            min="10"
            max="100"
            aria-label="Edad"
          />
          <label htmlFor="peso" className={styles.label}>Peso (kg)</label>
          <input
            id="peso"
            type="number"
            className={styles.inputField}
            value={peso}
            onChange={e => setPeso(e.target.value)}
            min="20"
            max="300"
            aria-label="Peso"
          />
          <label htmlFor="altura" className={styles.label}>Altura (cm)</label>
          <input
            id="altura"
            type="number"
            className={styles.inputField}
            value={altura}
            onChange={e => setAltura(e.target.value)}
            min="100"
            max="250"
            aria-label="Altura"
          />
          <label htmlFor="experiencia" className={styles.label}>Nivel de experiencia</label>
          <input
            id="experiencia"
            type="text"
            className={styles.inputField}
            value={experiencia}
            onChange={e => setExperiencia(e.target.value)}
            aria-label="Nivel de experiencia"
          />
        </>
      )}
      {rol === "entrenador" && (
        <>
          <label htmlFor="certificaciones" className={styles.label}>Certificaciones</label>
          <input
            id="certificaciones"
            type="text"
            className={styles.inputField}
            value={certificaciones}
            onChange={e => setCertificaciones(e.target.value)}
            aria-label="Certificaciones"
          />
          <label htmlFor="especialidades" className={styles.label}>Especialidades</label>
          <input
            id="especialidades"
            type="text"
            className={styles.inputField}
            value={especialidades}
            onChange={e => setEspecialidades(e.target.value)}
            aria-label="Especialidades"
          />
          <label htmlFor="experiencia" className={styles.label}>Años de experiencia</label>
          <input
            id="experiencia"
            type="text"
            className={styles.inputField}
            value={experiencia}
            onChange={e => setExperiencia(e.target.value)}
            aria-label="Años de experiencia"
          />
        </>
      )}

      <button type="submit" className={styles.button} aria-label="Guardar y continuar">
        Guardar y continuar
      </button>
    </form>
  );
}
