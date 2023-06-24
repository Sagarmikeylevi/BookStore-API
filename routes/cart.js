const express = require("express");
const router = express.Router();
const passport = require("passport");

const CartController = require("../controllers/CartController");

router.post("/addBooks", CartController.addBooks);

router.get("/getBooks", CartController.getBooks);

router.put("/update/:cartId", CartController.update);

router.delete("/delete/:cartId", CartController.delete);

module.exports = router;
