const express = require("express");
const router = express.Router();

const {
  getPeople,
  addPerson,
  getPerson,
  updatePerson,
  deletePerson,
} = require("../controllers/peopleController");

router.route("/").get(getPeople).post(addPerson);

router
  .route("/:personId")
  .get(getPerson)
  .patch(updatePerson)
  .delete(deletePerson);

module.exports = router;
