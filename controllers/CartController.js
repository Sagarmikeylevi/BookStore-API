const Book = require("../models/Book");
const Cart = require("../models/Cart");

module.exports.addBooks = async (req, res) => {
  try {
    const { bookId, qty } = req.body;

    // Check if the bookId already exists in the cart
    const existingCartItem = await Cart.findOne({ bookId });

    if (existingCartItem) {
      return res
        .status(400)
        .json({ error: "The book is already in the cart." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    // Update the totalQty of the book
    book.totalQty -= qty;
    await book.save();

    const cartItem = new Cart({
      bookId,
      imageURL: book.imageURL,
      title: book.title,
      author: book.author,
      price: book.price,
      totalQty: book.totalQty,
      Qty: qty,
      totalPrice: book.price * qty,
    });

    await cartItem.save();

    res.status(200).json({
      message: "A new book is added to the cart",
      data: {
        Item: cartItem,
      },
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res.status(500).json({
      error: "An error occurred while adding the book to the cart.",
    });
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

module.exports.update = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { totalQty, Qty } = req.body;
    const cart = await Cart.findById(cartId).populate("bookId").exec();

    if (!cart) {
      return res.status(404).json({ error: "Item not found." });
    }

    const bookID = cart.bookId._id;
    const book = await Book.findById(bookID);

    book.totalQty = totalQty;
    cart.totalQty = totalQty;
    cart.Qty = Qty;

    await cart.save();
    await book.save();
    
    res.status(200).json({
      message: "Successfully updated cart items",
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while updating the cart item." });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId).populate("bookId").exec();

    if (!cart) {
      return res.status(404).json({ error: "Item not found." });
    }

    const bookID = cart.bookId._id;
    const book = await Book.findById(bookID);

    book.totalQty += cart.totalQty;

    await book.save();

    await Cart.findByIdAndDelete(cartId);

    res.status(200).json({ message: "Successfully removed cart item" });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the item." });
  }
};
