export interface Product {
  imageUrl: string | Blob | undefined;
  id: string;
  name: string;
  price: number;
  categoria: string;
  featured: boolean;
  descripcion: string;
  imagenUrl: string;
  rating: number;
  stock: number;
}