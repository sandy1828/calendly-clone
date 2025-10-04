import { useEffect, useState } from "react";
import API from "../api/api";
import { format } from "date-fns";
import './BookingsList.css';

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]));
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="empty-text">No bookings yet.</p>
      ) : (
        <ul className="list">
          {bookings.map((b) => {
            // Ensure we have a proper Date object
            const startDate = b.start ? new Date(b.start) : null;

            return (
              <li
                key={b._id}
                className="list-item card flex flex-col gap-1 p-3"
              >
                <div>
                  <strong>Date & Time:</strong>{" "}
                  {startDate ? format(startDate, "PPP p") : "Invalid date"}
                </div>
                <div><strong>Name:</strong> {b.name || "No name"}</div>
                <div><strong>Email:</strong> {b.email || "No email"}</div>
                <div>
                  <strong>Google Meet:</strong>{" "}
                  {b.meetLink ? (
                    <a href={b.meetLink} target="_blank" rel="noopener noreferrer">
                      {b.meetLink}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
