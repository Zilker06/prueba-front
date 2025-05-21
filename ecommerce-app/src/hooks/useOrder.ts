import { collection, doc, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const useOrder = () => {
  const createOrder = async (
    userId: string,
    items: { productId: string; quantity: number; price: number }[],
    total: number
  ) => {
    try {
      // Crear la orden en Firestore
      const orderRef = collection(db, "orders");
      const newOrder = await addDoc(orderRef, {
        userId,
        items,
        total,
        createdAt: new Date(),
      });

      // Actualizar el stock de los productos
      for (const item of items) {
        const productRef = doc(db, "products", item.productId);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          const newStock = (productData.stock || 0) - item.quantity;

          if (newStock < 0) {
            throw new Error(
              `El producto ${productData.name} no tiene suficiente stock.`
            );
          }

          await updateDoc(productRef, { stock: newStock });
        } else {
          throw new Error(`El producto con ID ${item.productId} no existe.`);
        }
      }

      return newOrder.id; // Retornar el ID de la nueva orden
    } catch (error) {
      console.error("Error al crear la orden:", error);
      throw error;
    }
  };

  return { createOrder };
};