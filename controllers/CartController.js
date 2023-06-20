const Cart = require("../models/Cart");

module.exports.addBooks = async (req, res) => {
  try {
    Cart.uploadedImage(req, res, async (err) => {
      if (err) {
        console.log(`*****Multer Error: ${err}`);
        return res.status(500).json({ error: "Image upload failed." });
      }

      const { title, author, price, totalQty, totalPrice } = req.body;

      const imagePath = req.file.path;

      const newCart = new Cart({
        imageURL: imagePath,
        title,
        author,
        price,
        totalQty,
        totalPrice,
      });

      newCart.save();
      res.status(200).json({
        message: "Successfully added to the cart",
        data: {
          cartItems: newCart,
        },
      });
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res.status(500).json({ error: "An error occurred while adding the book to the cart." });
  }
};

module.exports.getBooks = async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.status(200).json({
      message: "Successfully retrieved cart items",
      data: {
        cartItems,
      },
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving cart items." });
  }
};

