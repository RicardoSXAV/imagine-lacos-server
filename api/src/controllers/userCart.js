const User = require("../models/User");
const Product = require("../models/Product");

exports.add = async (req, res) => {
  try {
    if (req.userData.role === "admin") {
      return res.status(401).json({
        error: true,
        message: "O administrador não possui um carrinho.",
      });
    }

    const { productId, productAmount } = req.body;

    const selectedProduct = await Product.findById(productId);

    if (!selectedProduct) {
      return res.status(401).json({
        error: true,
        message: "Não foi possível encontrar um produto com esse id.",
      });
    }

    const user = await User.findOne({ _id: req.userData.userId });

    if (user.cartList.length === 10) {
      return res.status(401).json({
        error: true,
        message: "Não é possível adicionar mais de 10 itens no carrinho.",
      });
    }

    const repeatedProduct = user.cartList.find(
      (product) => product.productId === productId
    );

    if (repeatedProduct) {
      return res.status(401).json({
        error: true,
        message: "Esse produto já foi adicionado ao carrinho!",
      });
    }

    user.cartList.push({
      productId,
      productName: selectedProduct.name,
      productPrice: selectedProduct.price,
      productImage: selectedProduct.images[0],
      productMaxQuantity: selectedProduct.quantity,
      productAmount: 1, // Default amount
    });
    await user.save();

    return res.status(200).json({
      error: false,
      updatedUser: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        cartList: user.cartList,
        profileImage: user.profileImage,
        postalInformation: user.postalInformation,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { removeId } = req.params;

    const user = await User.findOne({ _id: req.userData.userId });

    const productInCart = user.cartList.find(
      (product) => product.productId === removeId
    );

    if (!productInCart) {
      return res.status(404).json({
        error: true,
        message: "O produto não existe ou não está no carrinho.",
      });
    }

    user.cartList = user.cartList.filter(
      (product) => product.productId !== removeId
    );

    await user.save();

    return res.status(200).json({
      error: false,
      message: "O produto foi removido com sucesso do carrinho.",
      updatedUser: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        cartList: user.cartList,
        profileImage: user.profileImage,
        postalInformation: user.postalInformation,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
