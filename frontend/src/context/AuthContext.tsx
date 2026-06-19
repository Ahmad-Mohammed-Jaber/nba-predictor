/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useReducer } from "react";
import api, { setAccessToken } from "../configs/api.config";
import LoadingSpinner from "../components/ui/LoadingSpinner";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User; accessToken: string } }
  | { type: "LOGOUT" }
  | { type: "AUTH_INITIALIZED" };

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
        isLoading: false,
      };
    case "AUTH_INITIALIZED":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/auth/refresh");
        const { access_token } = res.data;

        const userRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const user = userRes.data;

        setAccessToken(access_token);
        dispatch({
          type: "LOGIN",
          payload: { user, accessToken: access_token },
        });
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        dispatch({ type: "AUTH_INITIALIZED" });
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const newToken = (event as CustomEvent).detail;
      dispatch({
        type: "LOGIN",
        payload: {
          user: state.user, // Keep existing user
          accessToken: newToken
        },
      });
    };

    const handleSessionExpired = () => {
      setAccessToken(null);
      dispatch({ type: "LOGOUT" });
    };

    window.addEventListener("auth-token-refreshed", handleTokenRefresh);
    window.addEventListener("auth-session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth-token-refreshed", handleTokenRefresh);
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, [state.user]);

  console.log(state.accessToken)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {state.isLoading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};