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
      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          email,
          rol,
          creadoEn: new Date(),
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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Completa tu perfil</h2>

      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>Nombre</label>
      <input
        type="text"
        className={styles.inputField}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <label className={styles.label}>Apellidos</label>
      <input
        type="text"
        className={styles.inputField}
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
        required
      />

      <label className={styles.label}>Email</label>
      <input
        type="email"
        className={styles.inputField}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        readOnly
      />

      <label className={styles.label}>Rol</label>
      <select
        className={styles.selectField}
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        required
      >
        <option value="atleta">Atleta</option>
        <option value="entrenador">Entrenador</option>
      </select>

      <button type="submit" className={styles.button}>
        Guardar y continuar
      </button>
    </form>
  );
}
