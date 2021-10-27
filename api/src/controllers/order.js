require("dotenv").config();

const axios = require("axios");

const User = require("../models/User");
const Order = require("../models/Order");

const usernamePasswordBuffer = Buffer.from(
  process.env.ASAP_KEY + ":" + process.env.ASAP_PASSWORD
);
const base64data = usernamePasswordBuffer.toString("base64");

exports.create = async (req, res) => {
  const { userId } = req.userData;

  const existingOrder = await Order.findOne({ userId });

  if (existingOrder) {
    return res.status(401).json({
      error: true,
      message: "You already have an order in progress.",
    });
  }

  const user = await User.findById(userId);

  const newOrder = new Order({
    userId,
    postalInformation: user.postalInformation,
  });
};

exports.shippingPrice = async (req, res) => {
  const { userId } = req.userData;

  const user = await User.findById(userId);

  const response = await axios.get(
    `https://app.asaplog.com.br/webservices/v1/consultarFrete?peso=1&valor=20&cep=${user.postalInformation.zipcode}&altura=50&largura=50&profundidade=50`,
    { headers: { Authorization: `Basic ${base64data}` } }
  );

  return res.status(200).json({
    price: response.data.preco,
    maxDaysToDeliver: response.data.prazoMaximo,
    status: response.data.status,
  });
};
