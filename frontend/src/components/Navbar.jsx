import { Link, useNavigate } from "react-router-dom";
import "../styles/style2.css";

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId"); // get userId

  if (!userName) return null; // hide navbar if not logged in

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-brand" onClick={() => navigate("/dashboard")} style={{cursor: "pointer"}}>
        Calendly Clone
      </h1>

      <div className="navbar-links">
        <span className="nav-user">Hello, {userName} 👋</span>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/availability" className="nav-link">
          Availability
        </Link>
        {/* ✅ dynamic booking link */}
        <Link to={`/book/${userId}`} className="nav-link">
          Booking Page
        </Link>
        <button onClick={logout} className="btn btn-danger btn-small">
          Logout
        </button>
      </div>
    </nav>
  );
}
