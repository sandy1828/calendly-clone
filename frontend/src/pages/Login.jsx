import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import "../styles/style.css"; 
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

      // Save user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name);

      // Redirect directly to user's booking page
      navigate(`/book/${res.data.userId}`);
      toast.success(`Welcome ${res.data.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1 className="welcome-header">Welcome to Calendly Clone 🎉</h1>

      <div className="form-card">
        <h2 className="form-title">Login</h2>
        <form onSubmit={submit} className="form">
          <input
            className="form-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging..." : "Login"}
          </button>
        </form>
        <p className="form-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="text-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
