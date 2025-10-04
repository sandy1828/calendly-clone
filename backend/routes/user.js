const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getMe, updateMe } = require("../controllers/userController");
router.get("/me", auth, getMe);
router.post("/me", auth, updateMe);
module.exports = router;
