const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  updatePassword,
  logout,
  forgotPassword,
  resetPassword,
  verifyUser,
  sendVerificationToken,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/update-password", protect, updatePassword);
router.post("/forgot-password", forgotPassword);
// router.get("/reset-password/:token/:userId", resetPasswordForm);
router.post("/reset-password/:token/:userId", resetPassword);
router.get("/verify-email/:token/:userId", verifyUser);
router.get("/send-verification-token/:email", sendVerificationToken);

// router.get("/e", (req, res) => {
//   res.end("hi");
// });

module.exports = router;
