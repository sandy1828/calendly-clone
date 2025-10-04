import { useState, useEffect } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/avai.css";

export default function AvailabilitySetup() {
  const [slots, setSlots] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    date: new Date(), // date only
    startMin: timeToMin("09:00"),
    endMin: timeToMin("17:00"),
    durationMin: 30,
    bufferMin: 0,
  });

  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    try {
      const res = await API.get("/availability/me");
      setSlots(res.data.slots || []);
    } catch {
      toast.error("Failed to load availability");
    }
  }

  async function save() {
    if (form.endMin <= form.startMin)
      return toast.error("End must be after start");

    const slotToSave = {
      ...form,
      start: new Date(
        form.date.getFullYear(),
        form.date.getMonth(),
        form.date.getDate(),
        Math.floor(form.startMin / 60),
        form.startMin % 60
      ),
      end: new Date(
        form.date.getFullYear(),
        form.date.getMonth(),
        form.date.getDate(),
        Math.floor(form.endMin / 60),
        form.endMin % 60
      ),
    };

    let updatedSlots = [...slots];
    if (editingIndex !== null) {
      updatedSlots[editingIndex] = slotToSave; // update existing
    } else {
      updatedSlots.push(slotToSave); // add new
    }

    try {
      await API.post("/availability", { slots: updatedSlots });
      setSlots(updatedSlots);
      setEditingIndex(null);
      resetForm();
      toast.success(editingIndex !== null ? "Slot updated" : "Slot added");
    } catch {
      toast.error("Failed to save");
    }
  }

  function editSlot(i) {
    const s = slots[i];
    setForm({
      date: new Date(s.start),
      startMin: timeToMinFromDate(s.start),
      endMin: timeToMinFromDate(s.end),
      durationMin: s.durationMin,
      bufferMin: s.bufferMin,
    });
    setEditingIndex(i);
  }

  async function deleteSlot(i) {
    const updated = slots.filter((_, idx) => idx !== i);
    try {
      await API.post("/availability", { slots: updated });
      setSlots(updated);
      toast.success("Slot deleted");
    } catch {
      toast.error("Failed to delete slot");
    }
  }

  function resetForm() {
    setForm({
      date: new Date(),
      startMin: timeToMin("09:00"),
      endMin: timeToMin("17:00"),
      durationMin: 30,
      bufferMin: 0,
    });
  }

  return (
    <div className="container">
      <h2 className="page-title">Set Your Availability</h2>

      {/* Input Card */}
      <div className="card form-card">
        <div className="form-grid">
          <div>
            <label>Date</label>
            <DatePicker
              selected={form.date}
              onChange={(date) => setForm({ ...form, date })}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <input
            type="time"
            className="form-input"
            value={minToTime(form.startMin)}
            onChange={(e) =>
              setForm({ ...form, startMin: timeToMin(e.target.value) })
            }
          />

          <input
            type="time"
            className="form-input"
            value={minToTime(form.endMin)}
            onChange={(e) =>
              setForm({ ...form, endMin: timeToMin(e.target.value) })
            }
          />

          <input
            type="number"
            className="form-input"
            placeholder="Duration (min)"
            value={form.durationMin}
            onChange={(e) =>
              setForm({ ...form, durationMin: Number(e.target.value) })
            }
          />

          <input
            type="number"
            className="form-input"
            placeholder="Buffer (min)"
            value={form.bufferMin}
            onChange={(e) =>
              setForm({ ...form, bufferMin: Number(e.target.value) })
            }
          />

          <button className="btn btn-primary" onClick={save}>
            {editingIndex !== null ? "Update Slot" : "Add Slot"}
          </button>

          {editingIndex !== null && (
            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Slots List */}
      <h3 className="slots-title">Your Slots</h3>
      <div className="slots-list">
        {slots.length === 0 ? (
          <p className="no-slots">No slots added yet.</p>
        ) : (
          slots.map((s, i) => (
            <div key={i} className="slot-item card">
              <div className="slot-info">
                <strong>
                  {new Date(s.start).toLocaleString()} -{" "}
                  {new Date(s.end).toLocaleString()}
                </strong>{" "}
                <span className="slot-meta">
                  ({s.durationMin} min, buffer {s.bufferMin} min)
                </span>
              </div>
              <div className="slot-actions">
                <button className="btn btn-small" onClick={() => editSlot(i)}>
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => deleteSlot(i)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* Utilities */
function timeToMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timeToMinFromDate(d) {
  const date = new Date(d);
  return date.getHours() * 60 + date.getMinutes();
}
