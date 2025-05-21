"use client";

import AuthGuard from "@/components/AuthGuard";
import { useGetOrders } from "@/hooks/useGetOrders";

export default function OrdersPage() {
  const { orders, loading, error } = useGetOrders();

  if (loading) return <p className="text-center">Cargando pedidos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <AuthGuard>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

        {orders.length === 0 ? (
          <p className="text-center">No tienes pedidos registrados.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg p-4 space-y-2"
              >
                <h2 className="text-lg font-semibold">Pedido ID: {order.id}</h2>
                <p className="text-gray-500">Fecha de compra: {order.createdAt}</p>
                <p className="text-gray-700 font-bold">
                  Total: ${order.total.toFixed(2)}
                </p>
                <div className="space-y-2">
                  <h3 className="text-md font-semibold">Artículos:</h3>
                  <ul className="list-disc pl-5">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-gray-600">
                        Producto ID: {item.productId}, Cantidad: {item.quantity}, Precio: ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
