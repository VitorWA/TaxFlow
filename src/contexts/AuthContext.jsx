import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/api/auth/me")
      .then(({ user: authenticatedUser }) => setUser(authenticatedUser))
      .catch((error) => {
        if (error.status !== 401) console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(email, password, remember = false) {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, remember }),
      });
      setUser(data.user);
      return data.user;
    },
    async logout() {
      await apiRequest("/api/auth/logout", { method: "POST" });
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
