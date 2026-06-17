import { NavLink } from "react-router"

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between bg-primary p-5">
        <div>
            <h1 className="text-accent font-bold text-2xl">NBA Predictor</h1>
        </div>
        <div className="flex text-accent gap-5">
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/teams"}>Teams</NavLink>
            
        </div>
    </nav>
  )
}
export default NavBar