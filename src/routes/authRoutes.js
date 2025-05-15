const express = require("express");
const router = express.Router();
const { signup, login, logout, profile } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", auth, logout);
router.get("/profile", auth, profile);

module.exports = router;