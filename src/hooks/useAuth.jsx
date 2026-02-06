/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { login as apiLogin, getCurrentUser, clearToken } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Try to load current user on first mount (if token exists)
  useEffect(() => {
    async function init() {
      try {
        await refreshUser();
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // token invalid, ignore
        clearToken();
        setUser(null);
      } finally {
        setInitializing(false);
      }
    }
    init();
  }, []);

  async function refreshUser() {
    const data = await getCurrentUser();
    setUser(data.user);
  }

  async function login(email, password) {
    const { user } = await apiLogin(email, password);
    setUser(user);
    return user;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = {
    user,
    initializing,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}