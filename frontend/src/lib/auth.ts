import { jwtDecode } from "jwt-decode";

export function getUserFromToken(token: string | null) {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token) as {
      email: string;
      role: string;
      sub: string;
    };
    return decoded;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}
