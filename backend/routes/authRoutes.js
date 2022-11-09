const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  updatePassword,
  logout,
  forgotPassword,
  resetPassword,
  resetPasswordForm,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/update-password", protect, updatePassword);
router.post("/forgot-password", forgotPassword);
// router.get("/reset-password/:token/:userId", resetPasswordForm);
router.post("/reset-password/:token/:userId", resetPassword);

module.exports = router;
