import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";

const AuthenticatedRoute = () => {
    const { state } = useAuthContext();

    if (state.isLoading)
    {
        return <div>Loading...</div>
    }

    if (!state.accessToken)
    {
        <Navigate to={'/login'} replace/>
    }
  
    return <Outlet />
};
export default AuthenticatedRoute;
