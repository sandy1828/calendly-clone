const Booking = require('../models/Booking');
const Availability = require('../models/Availability');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // total bookings
    const totalBookings = await Booking.countDocuments({ userId });

    // upcoming bookings (next 30 days)
    const now = new Date();
    const in30 = new Date();
    in30.setDate(now.getDate() + 30);
    const upcoming = await Booking.find({ userId, date: { $gte: now, $lte: in30 } }).sort({ date: 1 });

    // slots count (simple)
    const availList = await Availability.find({ userId });
    const totalSlots = availList.reduce((acc, a) => acc + (Array.isArray(a.slots) ? a.slots.length : 0), 0);

    res.json({
      totalBookings,
      upcomingCount: upcoming.length,
      totalSlots,
      upcoming: upcoming.slice(0, 6) // send few
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
