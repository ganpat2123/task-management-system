
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = Boolean(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("taskUser");
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">✓</span>
          <span>TaskFlow</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>

          {loggedIn ? (
            <>
              <NavLink to="/dashboard">
                Dashboard
              </NavLink>

              <button
                type="button"
                className="nav-logout"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>

              <Link
                to="/signup"
                className="nav-signup"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
