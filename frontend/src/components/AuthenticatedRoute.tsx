import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import NavBar from "./NavBar";

const AuthenticatedRoute = () => {
  const { state } = useAuthContext();

  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  if (state.accessToken === null) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
export default AuthenticatedRoute;
