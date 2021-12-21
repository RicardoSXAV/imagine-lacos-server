const Category = require("../models/Category");
const Product = require("../models/Product");

exports.list = async (req, res) => {
  const categories = await Category.find({});
  const categoryList = categories.map((category) => {
    return { id: category._id, name: category.name, image: category.imageURL };
  });

  res.status(200).json({ categoryList });
};

exports.countProducts = async (req, res) => {
  const { id } = req.params;

  const countProducts = await Product.countDocuments({ categoryId: id });

  res.status(200).json({ countProducts });
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findOne({ name });

    if (category) {
      return res.status(401).json({
        error: true,
        message: "Já existe uma categoria com esse nome!",
      });
    }

    const newCategory = new Category({
      name,
      imageURL: `http://localhost:5000/api/uploads/${req.file.filename}`,
      // imageId: result.public_id,
    });

    await newCategory.save();

    res.status(200).json({
      error: false,
      message: "A nova categoria foi criada!",
      object: {
        id: newCategory._id,
        name,
        image: `http://localhost:5000/api/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    await Product.remove({ categoryId: id });
    await category.remove();

    res
      .status(200)
      .json({ error: false, message: "A categoria foi deletada!" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
