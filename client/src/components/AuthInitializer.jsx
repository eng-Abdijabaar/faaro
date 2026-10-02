import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const AuthInitializer = ({ children }) => {
  const initialized = useAuthStore(
    (state) => state.initialized
  );

  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" />

          <p className="mt-4 text-sm font-medium text-text-secondary">
            Loading Faaro...
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthInitializer;