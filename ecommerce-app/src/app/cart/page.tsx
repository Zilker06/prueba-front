"use client";

import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doc, updateDoc, deleteDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth(); // Obtener el usuario autenticado
  const { cartItems, loading, error, refreshCart } = useCart(user?.uid || null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showForm, setShowForm] = useState(false); // Mostrar formulario emergente
  const [userData, setUserData] = useState({ address: "", email: "", phoneNumber: "" });

  // Calcular el precio total
  const totalPrice = cartItems.reduce((total, item) => {
    const quantity = Math.min(quantities[item.id] || item.quantity, item.stock); // Asegurarse de no exceder el stock
    return total + item.price * quantity;
  }, 0);

  // Manejar el cambio de cantidad
  const handleQuantityChange = async (itemId: string, newQuantity: number, stock: number) => {
    if (newQuantity > stock) {
      alert("No puedes ordenar más de lo que hay en stock.");
      return;
    }

    if (newQuantity <= 0) {
      await handleRemoveItem(itemId); // Eliminar el artículo si la cantidad es 0
      return;
    }

    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));

    // Actualizar la cantidad en Firestore
    const cartItemRef = doc(db, "users", user?.uid || "", "cart", itemId);
    await updateDoc(cartItemRef, { quantity: newQuantity });

    // Refrescar el carrito
    refreshCart();
  };

  // Manejar la eliminación de un artículo
  const handleRemoveItem = async (itemId: string) => {
    if (!user) return;

    const cartItemRef = doc(db, "users", user.uid, "cart", itemId);
    await deleteDoc(cartItemRef);

    // Refrescar el carrito
    refreshCart();
  };

  // Verificar si el usuario tiene los datos necesarios
  const checkUserData = async () => {
    try {
      const userRef = doc(db, "users", user?.uid || "");
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        if (!data.address || !data.email || !data.phoneNumber) {
          // Redirigir al usuario a la página de Perfil
          alert("Por favor, completa tu información en la página de Perfil.");
          router.push("/profile");
        } else {
          await handlePurchase(); // Proceder con la compra si los datos están completos
        }
      } else {
        alert("No se pudo verificar la información del usuario.");
        router.push("/profile"); // Redirigir a /perfil si no se encuentra el usuario
      }
    } catch (error) {
      console.error("Error al verificar los datos del usuario:", error);
      alert("Hubo un problema al verificar los datos del usuario.");
      router.push("/profile"); // Redirigir a /perfil en caso de error
    }
  };

  // Manejar el formulario de datos del usuario
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", user?.uid || "");
      await updateDoc(userRef, {
        address: userData.address,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      });

      setShowForm(false);
      alert("Datos guardados correctamente.");
      await handlePurchase(); // Proceder con la compra después de guardar los datos
    } catch (error) {
      console.error("Error al guardar los datos del usuario:", error);
      alert("Hubo un problema al guardar los datos. Por favor, inténtalo de nuevo.");
    }
  };

  // Manejar la compra
  const handlePurchase = async () => {
    try {
      const orderRef = collection(db, "orders");
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: Math.min(quantities[item.id] || item.quantity, item.stock),
        price: item.price,
      }));

      // Crear la orden en Firestore
      await addDoc(orderRef, {
        userId: user?.uid,
        items: orderItems,
        total: totalPrice,
        createdAt: new Date(),
      });

      // Actualizar el stock de los productos
      for (const item of cartItems) {
        const productRef = doc(db, "products", item.id);
        const newStock = item.stock - (quantities[item.id] || item.quantity);
        await updateDoc(productRef, { stock: newStock });
      }

      // Vaciar el carrito
      for (const item of cartItems) {
        const cartItemRef = doc(db, "users", user?.uid || "", "cart", item.id);
        await deleteDoc(cartItemRef);
      }

      alert("Compra realizada con éxito.");
      refreshCart(); // Refrescar el carrito después de la compra
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert("Hubo un problema al realizar la compra. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <AuthGuard>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

        {loading && <p className="text-center">Cargando carrito...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && cartItems.length === 0 && (
          <p className="text-center">Tu carrito está vacío.</p>
        )}

        {!loading && !error && cartItems.length > 0 && (
          <div className="space-y-4">
            {cartItems.map((item) => {
              const quantity = Math.min(quantities[item.id] || item.quantity, item.stock); // Asegurarse de no exceder el stock
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white shadow rounded-lg p-4 gap-4"
                >
                  <div className="flex items-center gap-4 flex-[40%] min-w-0">
                    <img
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                      <p className="text-gray-500 text-sm">
                        Precio por unidad: ${item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end flex-[60%] gap-6">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <button
                        onClick={() => handleQuantityChange(item.id, quantity - 1, item.stock)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, quantity + 1, item.stock)}
                        className={`bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 ${
                          quantity >= item.stock ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 font-bold min-w-[100px] text-right">
                    ${(item.price * quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
            <div className="text-right mt-4">
              <h3 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h3>
              <button
                onClick={checkUserData}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
              >
                Comprar
              </button>
            </div>
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
