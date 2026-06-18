import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import api, { setAccessToken } from "../configs/api.config";

const useLogout = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/auth/logout");
      setAccessToken(null);
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "An error occurred during logout";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
};

export default useLogout;