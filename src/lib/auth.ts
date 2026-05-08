import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


interface DecodedToken {
  name: string;
  email: string;
  id: string;
  role: string;
}

export function saveToken(token: string) {
  Cookies.set("token", token, { expires: 7 });
}

export function getToken() {
  return Cookies.get("token");
}

export function removeToken() {
  Cookies.remove("token");
}

export function getUserFromToken(): DecodedToken | null {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
}
