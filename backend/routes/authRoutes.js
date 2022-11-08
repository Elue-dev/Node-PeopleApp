const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  updatePassword,
  logout,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/update-password", protect, updatePassword);

module.exports = router;
