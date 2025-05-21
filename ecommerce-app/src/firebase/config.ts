import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc, getDocs, updateDoc, Timestamp, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDjc87KiH3KBdYnSiiX8CLaRmHtqC7gNs",
  authDomain: "sa-test-eccomerce.firebaseapp.com",
  projectId: "sa-test-eccomerce",
  storageBucket: "sa-test-eccomerce.firebasestorage.app",
  messagingSenderId: "545719619696",
  appId: "1:545719619696:web:0da7c9898dc9849c8fa4b5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const incrementProductSales = async (productId: string) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      sales: increment(1),
    });
    console.log("Ventas del producto incrementadas");
  } catch (error) {
    console.error("Error al incrementar ventas del producto:", error);
  }
};