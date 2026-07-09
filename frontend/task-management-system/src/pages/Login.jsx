import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);

            alert(res.data.message);

            navigate("/dashboard");

        } catch (err) {

            alert(err.response?.data?.message || "Login Failed");

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">
                                Login
                            </h2>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label>Username</label>

                                    <input
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>Password</label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                    />

                                </div>

                                <button
                                    className="btn btn-success w-100"
                                >
                                    Login
                                </button>

                            </form>

                            <p className="mt-3">

                                Don't have an account?

                                <Link to="/signup">
                                    Signup
                                </Link>

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;