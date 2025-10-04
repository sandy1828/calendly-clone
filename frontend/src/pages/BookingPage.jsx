import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function BookingPage() {
  const { userId: paramUserId } = useParams();
  const userId = paramUserId || localStorage.getItem("userId");
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    API.get(`/availability/user/${userId}`)
      .then((res) => setSlots(res.data.slots || []))
      .catch(() => toast.error("Failed to load slots"))
      .finally(() => setLoading(false));
  }, [userId]);

  const bookSlot = async (slot) => {
    if (!name || !email) return toast.error("Enter your name and email");

    try {
      await API.post("/bookings/create", {
        userId,
        name,
        email,
        startISO: new Date(slot.start).toISOString(),
        durationMin: slot.durationMin,
      });

      toast.success("Booking confirmed! Check your email for Meet link.");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to book slot");
    }
  };

  if (loading) return <p>Loading slots...</p>;

  return (
    <div className="container">
      <h2 className="page-title">Book a Slot</h2>

      <input
        type="text"
        placeholder="Your Name"
        className="form-input mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Your Email"
        className="form-input mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {slots.length === 0 ? (
        <p>No available slots</p>
      ) : (
        <ul className="list">
          {slots.map((s, i) => (
            <li
              key={i}
              className="card flex justify-between items-center p-2 mb-2"
            >
              <span>
                {s.start && s.end
                  ? `${format(
                      new Date(s.start),
                      "yyyy-MM-dd HH:mm"
                    )} - ${format(new Date(s.end), "HH:mm")} (${
                      s.durationMin
                    } min)`
                  : "Invalid slot date"}
              </span>
              <button className="btn btn-primary" onClick={() => bookSlot(s)}>
                Book
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
