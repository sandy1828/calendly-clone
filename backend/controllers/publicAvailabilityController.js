const Availability = require('../models/Availability');
const User = require('../models/User');

exports.getByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const availability = await Availability.find({ userId: user._id });
    res.json({ user: { id: user._id, name: user.name, username: user.username }, availability });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
