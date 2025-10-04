const mongoose = require("mongoose");
const Availability = require("../models/Availability");

/**
 * Set or update availability for the logged-in user
 */
exports.setAvailability = async (req, res) => {
  try {
    const { slots } = req.body;

    // Validate slots
    if (!Array.isArray(slots)) {
      return res.status(400).json({ msg: "Slots must be an array" });
    }

    // Optional: Validate each slot object
    for (const slot of slots) {
      if (!slot.start || !slot.end) {
        return res.status(400).json({ msg: "Each slot must have start and end dates" });
      }
      if (isNaN(new Date(slot.start)) || isNaN(new Date(slot.end))) {
        return res.status(400).json({ msg: "Invalid date in slots" });
      }
      if (new Date(slot.end) <= new Date(slot.start)) {
        return res.status(400).json({ msg: "Slot end must be after start" });
      }
    }

    let availability = await Availability.findOne({ userId: req.user.id });

    if (!availability) {
      availability = new Availability({ userId: req.user.id, slots });
    } else {
      availability.slots = slots;
    }

    await availability.save();
    res.json({ msg: "Availability saved successfully", availability });
  } catch (err) {
    console.error("setAvailability error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Get availability for the logged-in user
 */
exports.getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ userId: req.user.id });
    res.json({ slots: availability?.slots || [] });
  } catch (err) {
    console.error("getAvailability error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/**
 * Get availability for any user by ID (public access)
 */
exports.getUserAvailability = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const availability = await Availability.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.json({ slots: availability?.slots || [] });
  } catch (err) {
    console.error("getUserAvailability error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
