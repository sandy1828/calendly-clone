const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
], registerUser);

router.post("/login", [
  body("email").isEmail(),
  body("password").exists()
], loginUser);

module.exports = router;
