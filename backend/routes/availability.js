const { setAvailability, getAvailability, getUserAvailability } = require("../controllers/availabilityController");
const auth = require("../middleware/auth");
const router = require("express").Router();

router.post("/", auth, setAvailability);
router.get("/me", auth, getAvailability);
router.get("/user/:userId", getUserAvailability); // this route is needed for BookingPage

module.exports = router;
