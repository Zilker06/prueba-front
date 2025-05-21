"use client";

import { loginWithGoogle, loginWithEmail, registerWithEmail } from "@/lib/auth";
import GoogleButton from "@/components/GoogleButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useCreateUser } from "@/hooks/useCreateUser"; // Importar el hook para registrar usuarios

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { createUser } = useCreateUser(); // Usar el hook para registrar usuarios

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); // Redirigir al usuario si ya está autenticado
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailAuth = async () => {
    setLoading(true);
    const user = isRegister
      ? await registerWithEmail(email, name, password)
      : await loginWithEmail(email, password);
    setLoading(false);

    if (user) {
      await createUser(); // Registrar al usuario en Firestore
      router.push("/"); // Redirigir al usuario a la página principal
    } else {
      alert("Error en la autenticación");
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const user = await loginWithGoogle();
    setLoading(false);

    if (user) {
      await createUser(); // Registrar al usuario en Firestore
      router.push("/"); // Redirigir al usuario a la página principal
    } else {
      alert("Error al iniciar sesión con Google");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md w-full md:mt-0 md:mb-0 md:mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 px-4 py-2 border rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {isRegister && (
          <input
            type="name"
            placeholder="Nombre de usuario"
            className="w-full mb-4 px-4 py-2 border rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 px-4 py-2 border rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleEmailAuth}
          className="w-full bg-blue-600 text-white py-2 rounded-xl mb-4 hover:bg-blue-700"
        >
          {loading ? "Procesando..." : isRegister ? "Registrarse" : "Iniciar sesión"}
        </button>

        <div className="text-center mb-4">— o —</div>

        <div className="flex justify-center mb-4">
          <GoogleButton onClick={handleGoogle} />
        </div>

        <p className="text-sm mt-4 text-center">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </main>
  );
}
