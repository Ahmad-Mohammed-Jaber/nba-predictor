import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import api, { setAccessToken } from "../configs/api.config";

const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { access_token } = res.data;
          

      const userRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const user = userRes.data;

      setAccessToken(access_token);
      dispatch({ type: "LOGIN", payload: { user, accessToken: access_token } });
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "An error occurred during login";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};

export default useLogin;
