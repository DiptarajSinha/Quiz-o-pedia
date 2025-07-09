import { useEffect, useState } from "react";
import { getUserFromToken } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = getUserFromToken(token);
    if (decoded) {
      setUser({ email: decoded.email, role: decoded.role });
    }
  }, []);

  return user;
}
