import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import "../styles/style.css"; // External CSS
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name); // <- store name
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Welcome Header */}
      <h1 className="welcome-header">Welcome to Calendly Clone 🎉</h1>

      {/* Registration Form */}
      <div className="form-card">
        <h2 className="form-title">Register</h2>
        <form onSubmit={submit} className="form">
          <input
            className="form-input"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password (min 6)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/" className="text-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
