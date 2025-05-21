import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAuth } from "firebase/auth";

export const useCreateUser = () => {
  const createUser = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("No hay un usuario autenticado.");
        return;
      }

      const { uid, displayName, email } = currentUser;

      // Verificar si el usuario ya existe en Firestore
      const userRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        // Registrar al usuario en Firestore
        await setDoc(userRef, {
          name: displayName || "", // Si no hay displayName, guardar vacío
          email: email || "",
          createdAt: Timestamp.now(),
        });
        console.log("Usuario registrado en Firestore.");
      } else {
        console.log("El usuario ya existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return { createUser };
};