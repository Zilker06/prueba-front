"use client";

import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function ProfilePage() {
  const { user } = useAuth(); // Obtener el usuario autenticado
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Modo edición
  const [loading, setLoading] = useState(true);

  // Cargar los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData({
            name: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
          });

          // Si no existe `createdAt`, lo registramos
          if (!data.createdAt) {
            await updateDoc(userRef, {
              createdAt: serverTimestamp(),
            });
          }
        } else {
          // Si el documento no existe, creamos uno con `createdAt`
          await updateDoc(userRef, {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Manejar la actualización de los datos del usuario
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", user?.uid || "");
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(), // Actualizar la fecha de modificación
      });

      alert("Datos actualizados correctamente.");
      setIsEditing(false); // Salir del modo edición
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      alert("Hubo un problema al actualizar los datos. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return <p className="text-center">Cargando datos...</p>;
  }

  return (
    <AuthGuard>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Perfil</h1>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Información del usuario</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md font-semibold ${
              isEditing
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </button>
        </div>
        <form
          onSubmit={handleFormSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full border rounded-md p-2"
              disabled={!isEditing}
              placeholder="Nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full border rounded-md p-2"
              disabled={!isEditing}
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Número de teléfono</label>
            <input
              type="tel"
              value={userData.phoneNumber}
              onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
              className="w-full border rounded-md p-2"
              disabled={!isEditing}
              placeholder="Número de teléfono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
              className="w-full border rounded-md p-2"
              disabled={!isEditing}
              placeholder="Dirección"
            />
          </div>
          {isEditing && (
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          )}
        </form>
      </main>
    </AuthGuard>
  );
}
