import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/config";

export const useProducts = (topRated: boolean = false, maxResults: number = 5) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");

        // Si queremos los productos con mejor rating
        let productsQuery;
        if (topRated) {
          productsQuery = query(productsCollection, orderBy("rating", "desc"), limit(maxResults));
        } else {
          productsQuery = productsCollection;
        }

        const querySnapshot = await getDocs(productsQuery);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [topRated, maxResults]);

  return { products, loading, error };
};