import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    return (

        <nav
            className="navbar navbar-expand-lg navbar-dark shadow fixed-top"
            style={{
                background: "linear-gradient(90deg, #2563EB, #1E40AF)"
            }}
        >

            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">
                    Task Manager
                </Link>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbar"
                >

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/signup">
                                Signup
                            </Link>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;