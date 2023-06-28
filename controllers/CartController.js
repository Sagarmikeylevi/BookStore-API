const Book = require("../models/Book");
const Cart = require("../models/Cart");
const UserCart = require("../models/UserCart");

module.exports.addBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId, qty } = req.body;

    let userCart = await UserCart.findOne({ user: userId });

    if (!userCart) {
      userCart = await UserCart.create({ user: userId });
    }

    const items = userCart.cartItems;

    for (let item of items) {
      const cart = await Cart.findById(item);
      if (cart.bookId.toString() === bookId) {
        return res.status(409).json({ error: "The book is already there" });
      }
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

    userCart.cartItems.push(cartItem);
    await userCart.save();

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

    book.totalQty += cart.Qty;

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
