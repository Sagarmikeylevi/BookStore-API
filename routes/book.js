const express = require("express");
const router = express.Router();

const BookController = require("../controllers/BookController");

router.post("/add", BookController.add);
router.get("/getbooks", BookController.getAll);
router.get("/getbook/:id", BookController.getBookByID);

module.exports = router;
