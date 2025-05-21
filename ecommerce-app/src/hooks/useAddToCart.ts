import { doc, getDoc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export const useAddToCart = () => {
  const addToCart = async (uid: string, productId: string, quantity: number = 1) => {
    try {
      // Referencia al producto en Firestore
      const productRef = doc(db, "products", productId);
      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        throw new Error("El producto no existe.");
      }

      const productData = productSnapshot.data();
      const stock = productData?.stock;

      if (stock < quantity) {
        throw new Error("No puedes agregar más productos de los disponibles en stock.");
      }

      // Referencia al carrito del usuario
      const cartItemRef = doc(db, "users", uid, "cart", productId);
      const cartItemSnapshot = await getDoc(cartItemRef);

      const currentQuantity = cartItemSnapshot.exists()
        ? cartItemSnapshot.data()?.quantity || 0
        : 0;

      if (currentQuantity + quantity > stock) {
        throw new Error("La cantidad total supera el stock disponible.");
      }

      // Agregar o actualizar el producto en el carrito
      await setDoc(
        cartItemRef,
        {
          quantity: increment(quantity),
          addedAt: serverTimestamp(),
        },
        { merge: true } // Si el producto ya existe, incrementa la cantidad
      );

      console.log("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  return { addToCart };
};