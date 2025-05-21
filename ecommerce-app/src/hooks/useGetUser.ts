import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

interface UserData {
  uid: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useGetUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userRef = doc(db, "users", authUser.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setUser({
              uid: authUser.uid,
              name: data.name || "",
              email: data.email || authUser.email || "",
              phoneNumber: data.phoneNumber || "",
              address: data.address || "",
              createdAt: data.createdAt
                ? new Date(data.createdAt.seconds * 1000).toLocaleString()
                : undefined,
              updatedAt: data.updatedAt
                ? new Date(data.updatedAt.seconds * 1000).toLocaleString()
                : undefined,
            });
          } else {
            // Si no hay datos en Firestore, usar solo los datos de Firebase Auth
            setUser({
              uid: authUser.uid,
              name: authUser.displayName || "",
              email: authUser.email || "",
              phoneNumber: "",
              address: "",
            });
          }
        } catch (err) {
          console.error("Error al obtener los datos del usuario:", err);
          setError("No se pudieron cargar los datos del usuario.");
        }
      } else {
        setUser(null); // Usuario no autenticado
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar el componente
  }, []);

  return { user, loading, error };
};