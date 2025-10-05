const jwt = require("jsonwebtoken");

function generateZoomToken() {
  const payload = {
    iss: process.env.ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // valid 5 minutes
  };
  return jwt.sign(payload, process.env.ZOOM_API_SECRET);
}

module.exports = { generateZoomToken };
