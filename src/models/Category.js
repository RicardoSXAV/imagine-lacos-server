const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: "O nome da categoria é necessária.",
    },
    imageURL: {
      type: String,
    },
    imageId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
