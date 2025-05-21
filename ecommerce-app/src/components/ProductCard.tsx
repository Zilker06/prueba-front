import { Product } from "@/types";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAuth } from "@/hooks/useAuth";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useAddToCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      await addToCart(user.uid, product.id, 1);
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      alert("Hubo un problema al agregar el producto al carrito.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <div className="relative">
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className={`w-full h-48 object-cover rounded-md mb-4 ${
            !product.featured ? "grayscale" : ""
          }`}
        />
        {!product.featured && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Producto agotado
          </span>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{product.categoria}</p>
      <p className="text-gray-700 font-bold mb-2">${product.price}</p>
      { product.stock < 50 && product.stock > 1 && (
        <p className="text-red-600 text-sm font-semibold mb-2">
          Menos de 50 unidades disponibles
        </p>
      )}
      { product.stock === 1 && (
        <p className="text-red-600 text-sm font-semibold mb-2">
          ULTIMA UNIDAD DISPONIBLE
        </p>
      )}
      <button
        onClick={handleAddToCart}
        className={`mt-auto py-2 px-4 rounded-lg font-semibold transition ${
          product.featured
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
        disabled={!product.featured}
      >
        {product.featured ? "Agregar al carrito" : "No disponible"}
      </button>
    </div>
  );
}