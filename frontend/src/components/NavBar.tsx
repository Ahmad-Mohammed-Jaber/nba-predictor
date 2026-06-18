import { NavLink, useNavigate } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext";
import NavAuthButton from "./NavAuthButton";
import useLogout from "../hooks/useLogout";

const NavBar = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();

  return (
    <nav className="flex items-center justify-between bg-primary p-5">
      <div className="flex items-center gap-5">
        <h1 className="text-accent font-bold text-2xl">NBA Predictor</h1>
        <div className="flex text-accent gap-3">
          <NavLink to={"/"}>Home</NavLink>
          <NavLink to={"/teams"}>Teams</NavLink>
        </div>
      </div>
      {
        state.user ? (
          <NavAuthButton text={'Log out'} onClick={logout} />
        ) : (
          <NavAuthButton text={'Login in'} onClick={() => navigate("/login")} />
        )
      }
    </nav>
  );
};

export default NavBar;
