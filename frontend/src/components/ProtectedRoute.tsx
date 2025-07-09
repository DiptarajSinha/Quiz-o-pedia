"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  role?: "admin" | "user";
}

export default function ProtectedRoute({ children, role }: Props) {
  const router = useRouter();
  const user = useAuth();
  const [checking, setChecking] = useState(true); // NEW

  useEffect(() => {
    if (!user) return;

    if (role && user.role !== role) {
      router.replace("/"); // unauthorized, redirect
    }

    setChecking(false); // finished checking
  }, [user, router, role]);

  if (!user || checking) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-muted-foreground">
        Checking permissions...
      </div>
    );
  }

  return <>{children}</>;
}
