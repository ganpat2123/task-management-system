
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        username: form.username.trim(),
        password: form.password
      });

      if (!res.data.token) {
        throw new Error("Login token missing");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "taskUser",
        JSON.stringify(res.data.user || {
          username: form.username.trim()
        })
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand auth-brand">
          <span className="brand-icon">✓</span>
          <span>TaskFlow</span>
        </Link>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Log in to manage your daily tasks.</p>
        </div>

        {location.state?.message && (
          <div className="alert alert-success">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="loginUsername">
              Username or Email
            </label>
            <input
              id="loginUsername"
              className="form-control"
              placeholder="Enter username or email"
              autoComplete="username"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              className="form-control"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              required
            />
          </div>

          <label className="check-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) =>
                setShowPassword(e.target.checked)
              }
            />
            Show password
          </label>

          <button
            type="submit"
            className="btn-main w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-bottom">
          Don't have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
