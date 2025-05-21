import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const useCart = (uid: string | null) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los datos del carrito
  const fetchCart = async () => {
    if (!uid) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cartRef = collection(db, "users", uid, "cart");
      const cartSnapshot = await getDocs(cartRef);

      const cartData = await Promise.all(
        cartSnapshot.docs.map(async (cartDoc) => {
          const cartItem = cartDoc.data();
          const productRef = doc(db, "products", cartDoc.id); // Relacionar con la colección de productos
          const productSnapshot = await getDoc(productRef);

          if (productSnapshot.exists()) {
            return {
              id: cartDoc.id,
              ...cartItem,
              ...productSnapshot.data(), // Combinar datos del carrito con los detalles del producto
            };
          } else {
            console.warn(`Producto con ID ${cartDoc.id} no encontrado.`);
            return null;
          }
        })
      );

      setCartItems(cartData.filter((item) => item !== null)); // Filtrar productos no encontrados
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
      setError("No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar el carrito
  const refreshCart = async () => {
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [uid]);

  return { cartItems, loading, error, refreshCart };
};