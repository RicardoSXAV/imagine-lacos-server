const mongoose = require("mongoose");
const pagination = require("mongoose-aggregate-paginate-v2");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userInfo: {
      type: Object,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentInfo: {
      type: Object,
      required: false,
    },
    postalInformation: {
      type: Object,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(pagination);

module.exports = mongoose.model("Order", OrderSchema);
