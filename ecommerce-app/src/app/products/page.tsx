"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      {loading && <p className="text-center">Cargando productos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
