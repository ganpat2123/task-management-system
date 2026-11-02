
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return setError(
        "Username must be 3–30 characters. Use letters, numbers or _."
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Enter a valid email address.");
    }

    if (form.password.length < 8) {
      return setError("Password must have at least 8 characters.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      await API.post("/auth/register", {
        username,
        email,
        password: form.password
      });

      navigate("/login", {
        state: {
          message: "Account created! Please log in."
        }
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Check your connection."
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
          <h1>Create an account</h1>
          <p>Plan your day. Track your progress.</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              className="form-control"
              placeholder="Enter your username"
              autoComplete="username"
              value={form.username}
              onChange={change}
              minLength={3}
              maxLength={30}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={change}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={change}
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter password again"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={change}
              minLength={8}
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
            Show passwords
          </label>

          <button
            type="submit"
            className="btn-main w-100"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-bottom">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default Signup;