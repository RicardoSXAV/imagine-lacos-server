const Product = require("../models/Product");
const Category = require("../models/Category");

exports.list = async (req, res) => {
  try {
    const aggregate_options = [];

    const page = parseInt(req.query.page) || 1;
    const limit = 9;

    // Pagination options
    const options = {
      page,
      limit,
      collation: { locale: "br" },
      customLabels: {
        totalDocs: "totalResults",
        docs: "events",
      },
      sort: {
        createdAt: req.query.recent ? "desc" : "asc",
      },
    };

    const match = {};

    if (req.query.name) {
      match.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.category) {
      match.category = { $regex: new RegExp(`^${req.query.category}$`) };
    }

    aggregate_options.push({ $match: match });

    const myAggregate = Product.aggregate(aggregate_options);

    const result = await Product.aggregatePaginate(myAggregate, options);

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    console.log(req.files);

    const { category, name, price, quantity, description } = req.body;

    const product = await Product.findOne({ name });

    if (product) {
      return res.status(401).json({
        error: true,
        message: "Já existe um produto com esse nome!",
      });
    }

    const selectedCategory = await Category.findOne({ name: category });

    if (!selectedCategory) {
      return res.status(401).json({
        error: true,
        message: "Não existe uma categoria com esse nome!",
      });
    }

    const imagesURL = [];
    const imagesId = [];

    for (file of req.files) {
      imagesURL.push(`http://localhost:5000/api/uploads/${file.filename}`);
      // imagesId.push(result.public_id);
    }

    if (imagesURL.length === 0) {
      res.status(401).json({
        error: "true",
        message: "Não foi possível fazer upload das imagens!",
      });
    }

    const newProduct = await new Product({
      categoryId: selectedCategory._id,
      category,
      name,
      price,
      quantity,
      description,
      images: imagesURL,
    });

    await newProduct.save();

    res.status(200).json({
      error: false,
      message: "O novo produto foi criado!",
      object: {
        _id: newProduct._id,
        category,
        categoryId: newProduct.categoryId,
        name: newProduct.name,
        price,
        images: newProduct.images,
        quantity,
        description,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(401).json({
        error: true,
        message: "O produto com o id fornecido não existe!",
      });
    }

    await product.remove();

    res.status(200).json({ error: false, message: "O produto foi deletado!" });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
