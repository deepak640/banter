import { jwtDecode } from "jwt-decode";
const AUTH_TOKEN = "magitatriontoken";
export const decodeToken = (token: string) => {
  if (token) {
    const decodedObj = jwtDecode(token);
    return decodedObj;
  }
  return null;
};

export const setJwt = (val: string) => {
  if (window && typeof window !== "undefined") {
    const token = window.localStorage.setItem(AUTH_TOKEN, val);
    return token;
  }
};

export const getJwt = () => {
  if (window && typeof window !== "undefined") {
    const token = window.localStorage.getItem(AUTH_TOKEN);
    return token;
  }
};

export const removeJwt = () => {
  if (window && typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN);
    return;
  }
};
