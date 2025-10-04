const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { create, createPublic, listMy } = require("../controllers/bookingController");
const { getUserAvailability } = require("../controllers/availabilityController");

// Host booking routes
router.post("/", auth, create);
router.get("/my", auth, listMy);

// Public booking route
router.post("/create", createPublic);
router.get("/user/:userId", getUserAvailability);

module.exports = router;
