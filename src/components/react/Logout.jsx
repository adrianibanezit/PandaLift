// src/components/LogoutButton.jsx
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";

export default function LogoutButton() {
  const auth = getAuth();
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // Redirige tras logout
    } catch (err) {
      setError("Error cerrando sesión. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        aria-label="Cerrar sesión"
      >
        Cerrar sesión
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
}
