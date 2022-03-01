const mongoose = require("mongoose");
const pagination = require("mongoose-aggregate-paginate-v2");

const ProductSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    category: {
      type: String,
      required: "A categoria do produto é necessária.",
    },
    name: {
      type: String,
      unique: true,
      required: "O nome do produto é necessário.",
    },
    price: {
      type: Number,
      require: "O preço do produto é necessário.",
    },
    quantity: {
      type: Number,
      require: "A quantidade de produtos é necessária.",
    },
    description: {
      type: String,
      required: "A descrição do produto é necessária.",
    },
    images: {
      type: Array,
      required: "É necessário ter ao menos uma imagem.",
    },
    imagesId: {
      type: Array,
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(pagination);

module.exports = mongoose.model("Product", ProductSchema);
