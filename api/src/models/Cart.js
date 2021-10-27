const mongoose = require("mongoose");
const pagination = require("mongoose-aggregate-paginate-v2");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  productList: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
      },
      productName: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      productImage: {
        type: String,
        required: false,
      },
      productQuantity: {
        type: Number,
        require: false,
      },
    },
  ],
});

CartSchema.plugin(pagination);

module.exports = mongoose.model("Cart", CartSchema);
