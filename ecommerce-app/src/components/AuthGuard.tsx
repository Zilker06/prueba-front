"use client";

import { useEffect, useState } from "react";
import { onAuthChange } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        router.push("/login");
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (checking) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return <>{children}</>;
}
