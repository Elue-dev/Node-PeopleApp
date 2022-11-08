const express = require("express");
const router = express.Router();

const { getAllUsers, getSingleUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAllUsers);
router.route("/:userId").get(getSingleUser);

module.exports = router;
