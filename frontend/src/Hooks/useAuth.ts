"use client";

import { useState, useEffect } from "react";
import { getToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  _id: string; // Adjust this to your token's payload structure
  exp: number;
  hashId: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          const token = { _id: decodedToken._id, hashId: decodedToken.hashId };
          setUser(token);
          setIsAuthenticated(true);
        } else {
          // Token expired
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  return { user, isAuthenticated, isLoading };
}
