const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  timezone: { type: String, default: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
