const express = require("express");
const router = express.Router();
const passport = require("passport");

const CartController = require("../controllers/CartController");

router.post(
  "/addBooks",
  passport.authenticate("jwt", { session: false }),
  CartController.addBooks
);

module.exports = router;
