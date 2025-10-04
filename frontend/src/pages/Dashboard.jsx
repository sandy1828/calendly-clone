import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { format } from "date-fns";
import CalendarMini from "../components/CalendarMini";
import "../style/dash.css";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, upcoming: 0, slots: 0 });
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState([]);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const bookingLink = `${window.location.origin}/book/${userId}`;

  function formatTime(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = ((h + 11) % 12) + 1;
    return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
  }

  useEffect(() => {
    async function load() {
      try {
        const b = await API.get("/bookings/my");
        const av = await API.get("/availability/me");

        setStats({
          total: b.data.length,
          upcoming: b.data.filter((x) => new Date(x.start) > new Date()).length,
          slots: (av.data.slots || []).length,
        });

        setAvailability(av.data.slots || []);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(bookingLink);
    toast.success("Booking link copied!");
  };

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading dashboard...</p>
      </div>
    );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome back, {userName} 👋</h1>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card gradient-card">
          <h2>{stats.total}</h2>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card gradient-card blue">
          <h2>{stats.upcoming}</h2>
          <p>Upcoming</p>
        </div>
        <div className="stat-card gradient-card green">
          <h2>{stats.slots}</h2>
          <p>Available Slots</p>
        </div>
      </div>

      {/* Booking Link + Buttons */}
      <div className="actions-section">
        <button
          onClick={() => (window.location.href = "/availability")}
          className="btn btn-primary"
        >
          Set Availability
        </button>
        <button
          onClick={() => (window.location.href = "/bookings")}
          className="btn btn-outline"
        >
          View Bookings
        </button>
        <div className="booking-link" onClick={copyLink}>
          <i className="fa fa-link"></i> {bookingLink}
        </div>
      </div>

      {/* Calendar & Quick Actions */}
      <div className="dashboard-flex">
        <div className="calendar-section">
          <h3>Mini Calendar</h3>
          <CalendarMini />
          <div className="availability-card">
            <h3>Your Upcoming Availability</h3>
            {availability.length === 0 && <p>No slots set yet.</p>}
            <ul>
              {availability
                .filter((s) => new Date(s.start) >= new Date()) // show only future slots
                .sort((a, b) => new Date(a.start) - new Date(b.start)) // sort by date
                .slice(0, 5) // show top 5 upcoming slots
                .map((s, i) => (
                  <li key={i}>
                    <span>{format(new Date(s.start), "yyyy-MM-dd")}</span>
                    <span>
                      {format(new Date(s.start), "HH:mm")} -{" "}
                      {format(new Date(s.end), "HH:mm")}
                    </span>
                  </li>
                ))}
            </ul>
            {availability.length > 5 && (
              <button
                onClick={() => (window.location.href = "/availability")}
                className="btn btn-small btn-outline"
              >
                View All
              </button>
            )}
          </div>
        </div>

        {/* <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="card">
            <button
              onClick={() => (window.location.href = "/availability")}
              className="btn btn-primary btn-block"
            >
              Edit Availability
            </button>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="btn btn-outline btn-block"
            >
              Edit Profile
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
