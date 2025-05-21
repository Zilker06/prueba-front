"use client";

import { useEffect, useState } from "react";
import { onAuthChange } from "@/lib/auth";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { useProducts } from "@/hooks/useProducts";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const { products, loading, error } = useProducts(true, 4); // Obtener los 4 productos destacados

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6">
      <div className="w-full">
        <HeroSection />
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
          {loading && <div className="text-center py-8">Cargando productos...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Link href="/products">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                Conoce todos nuestros productos
              </button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
