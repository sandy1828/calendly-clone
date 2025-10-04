const mongoose = require("mongoose"); // important

const SlotSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true }, // full date
    startMin: Number, // minutes from midnight
    endMin: Number, // minutes from midnight
    start: { type: Date, required: true }, // actual start datetime
    end: { type: Date, required: true }, // actual end datetime
    durationMin: { type: Number, default: 30 },
    bufferMin: { type: Number, default: 0 },
  },
  { _id: false }
);

const AvailabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slots: [
      {
        start: Date,
        end: Date,
        durationMin: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Availability", AvailabilitySchema);
