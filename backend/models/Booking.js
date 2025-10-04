const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  email: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  durationMin: Number,
  bufferMin: Number,
  meetLink: String,
  status: { type: String, default: "confirmed" }
});


module.exports = mongoose.model("Booking", bookingSchema);
