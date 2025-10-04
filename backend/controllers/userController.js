const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.updateMe = async (req, res) => {
  const { name, timezone, password } = req.body;
  try {
    const update = {};
    if (name) update.name = name;
    if (timezone) update.timezone = timezone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
