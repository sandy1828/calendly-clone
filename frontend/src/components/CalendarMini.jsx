import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/styleca.css";

export default function CalendarMini() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [bookings, setBookings] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(month, year);

  const arr = Array.from({ length: firstDay }).map(() => null)
    .concat(Array.from({ length: totalDays }, (_, i) => i + 1));

  // 🔹 Fetch bookings
  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/bookings/my");
        const bookedDates = res.data.map((b) => ({
          date: new Date(b.date),
          slot: b.slot,
          name: b.name,
          email: b.email,
        }));
        setBookings(bookedDates);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    }
    load();
  }, []);

  // 🔹 Check if a date has any bookings
  function isBooked(day) {
    if (!day) return false;
    return bookings.some(
      (b) =>
        b.date.getDate() === day &&
        b.date.getMonth() === month &&
        b.date.getFullYear() === year
    );
  }

  // 🔹 Handle click on a date
  function handleDateClick(day) {
    if (!day) return;
    const selected = new Date(year, month, day);
    setSelectedDate(selected);

    const sameDayBookings = bookings.filter(
      (b) =>
        b.date.getDate() === day &&
        b.date.getMonth() === month &&
        b.date.getFullYear() === year
    );
    setAppointments(sameDayBookings);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="calendar-header">
          <button
            className="nav-btn"
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear(year - 1);
              } else setMonth(month - 1);
            }}
          >
            &lt;
          </button>
          <h3>{months[month]} {year}</h3>
          <button
            className="nav-btn"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear(year + 1);
              } else setMonth(month + 1);
            }}
          >
            &gt;
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div className="calendar-day-name" key={d}>
              {d}
            </div>
          ))}

          {arr.map((d, i) => {
            const isToday =
              d === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const booked = isBooked(d);
            const selected =
              selectedDate &&
              selectedDate.getDate() === d &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            return (
              <div
                key={i}
                className={`calendar-day ${isToday ? "today" : ""} ${booked ? "booked" : ""} ${selected ? "selected" : ""}`}
                onClick={() => handleDateClick(d)}
                title={booked ? "Has bookings" : ""}
              >
                {d || ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments list below calendar */}
      {selectedDate && (
        <div className="appointments-card">
          <h4>
            {appointments.length
              ? `Appointments on ${selectedDate.toDateString()}`
              : `No Appointments on ${selectedDate.toDateString()}`}
          </h4>
          {appointments.map((a, i) => (
            <div key={i} className="appointment-item">
              <strong>{a.name}</strong> — {a.email}  
              <br />
              <small>Slot: {a.slot}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
