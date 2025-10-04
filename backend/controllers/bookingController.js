const Booking = require("../models/Booking");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// -------------------
// Protected create (host adds booking)
// -------------------
exports.create = async (req, res) => {
  try {
    const { name, email, startISO, durationMin } = req.body;

    // Validate startISO and duration
    if (!startISO || isNaN(new Date(startISO))) {
      return res.status(400).json({ msg: "Invalid or missing start date" });
    }
    if (!durationMin || isNaN(Number(durationMin)) || Number(durationMin) <= 0) {
      return res.status(400).json({ msg: "Invalid or missing duration" });
    }

    const start = new Date(startISO);
    const end = new Date(start.getTime() + Number(durationMin) * 60000);

    // Conflict check
    const conflict = await Booking.findOne({
      userId: req.user.id,
      status: "confirmed",
      $or: [
        { start: { $lt: end, $gte: start } },
        { end: { $gt: start, $lte: end } },
        { start: { $lte: start }, end: { $gte: end } },
      ],
    });
    if (conflict) return res.status(400).json({ msg: "Slot already booked" });

    // Generate meet link
    const meetLink = `https://meet.google.com/${Math.random()
      .toString(36)
      .substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`;

    // Save booking
    const booking = await Booking.create({
      userId: req.user.id,
      name,
      email,
      start,
      end,
      status: "confirmed",
      meetLink,
    });

    const formattedDate = start.toLocaleString();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    // Email to guest
    await transporter.sendMail({
      from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed, ${name}! 🎉`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Your booking is confirmed ✅</p>
        <p><strong>Date & Time:</strong> ${formattedDate}</p>
        <p><strong>Duration:</strong> ${durationMin} minutes</p>
        <p><strong>Google Meet Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>
        <br/>
        <p>See you soon!<br/>Calendly Clone Team 🤝</p>
      `,
    });

    // Email to host
    const host = await User.findById(req.user.id);
    if (host?.email) {
      await transporter.sendMail({
        from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
        to: host.email,
        subject: `New Booking from ${name}`,
        html: `
          <h2>Hi ${host.name || "Host"},</h2>
          <p>${name} (${email}) booked a slot on ${formattedDate}.</p>
          <p><strong>Duration:</strong> ${durationMin} minutes</p>
          <p><strong>Google Meet Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>
          <br/>
          <p>Check your schedule in Calendly Clone.</p>
        `,
      });
    }

    res.json({ booking, meetLink });
  } catch (err) {
    console.error("Failed to create booking:", err);
    res.status(500).json({ msg: "Failed to create booking", error: err.message });
  }
};

// -------------------
// Public booking (visitor books using host's link)
// -------------------
exports.createPublic = async (req, res) => {
  try {
    const { userId, name, email, startISO, durationMin } = req.body;

    // Validate startISO and duration
    if (!startISO || isNaN(new Date(startISO))) {
      return res.status(400).json({ msg: "Invalid or missing start date" });
    }
    if (!durationMin || isNaN(Number(durationMin)) || Number(durationMin) <= 0) {
      return res.status(400).json({ msg: "Invalid or missing duration" });
    }

    const start = new Date(startISO);
    const end = new Date(start.getTime() + Number(durationMin) * 60000);

    // Conflict check
    const conflict = await Booking.findOne({
      userId,
      status: "confirmed",
      $or: [
        { start: { $lt: end, $gte: start } },
        { end: { $gt: start, $lte: end } },
        { start: { $lte: start }, end: { $gte: end } },
      ],
    });
    if (conflict) return res.status(400).json({ msg: "Slot already booked" });

    // Generate meet link
    const meetLink = `https://meet.google.com/${Math.random()
      .toString(36)
      .substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}`;

    // Save booking
    const booking = await Booking.create({
      userId,
      name,
      email,
      start,
      end,
      status: "confirmed",
      meetLink,
    });

    const formattedDate = start.toLocaleString();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    // Email to visitor
    await transporter.sendMail({
      from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Meeting Confirmed, ${name}! 🎉`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Your booking is confirmed ✅</p>
        <p><strong>Date & Time:</strong> ${formattedDate}</p>
        <p><strong>Duration:</strong> ${durationMin} minutes</p>
        <p><strong>Google Meet Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>
        <br/>
        <p>See you soon!<br/>Calendly Clone Team 🤝</p>
      `,
    });

    // Email to host
    const host = await User.findById(userId);
    if (host?.email) {
      await transporter.sendMail({
        from: `"Calendly Clone" <${process.env.MAIL_USER}>`,
        to: host.email,
        subject: `New Booking from ${name}`,
        html: `
          <h2>Hi ${host.name || "Host"},</h2>
          <p>${name} (${email}) booked a slot on ${formattedDate}.</p>
          <p><strong>Duration:</strong> ${durationMin} minutes</p>
          <p><strong>Google Meet Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>
          <br/>
          <p>Check your schedule in Calendly Clone.</p>
        `,
      });
    }

    res.json({ msg: "Booking confirmed & emails sent!", booking, meetLink });
  } catch (err) {
    console.error("Failed to send public booking email:", err);
    res.status(500).json({ msg: "Failed to book slot", error: err.message });
  }
};

// -------------------
// List all bookings for host
// -------------------
exports.listMy = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ start: 1 });
    res.json(bookings);
  } catch (err) {
    console.error("Failed to list bookings:", err);
    res.status(500).json({ msg: err.message });
  }
};
