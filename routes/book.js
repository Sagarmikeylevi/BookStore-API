const express = require("express");
const router = express.Router();
const passport = require("passport");

const BookController = require("../controllers/BookController");

router.post("/add", BookController.add);
router.get("/getbooks", BookController.getAll);
router.get(
  "/getbook/:id",
  passport.authenticate("jwt", { session: false }),
  BookController.getBookByID
);
router.put(
  "/update/:bookId",
  passport.authenticate("jwt", { session: false }),
  BookController.update
);
router.delete(
  "/delete/:bookId",
  passport.authenticate("jwt", { session: false }),
  BookController.delete
);

module.exports = router;
