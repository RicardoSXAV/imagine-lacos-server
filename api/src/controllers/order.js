require("dotenv").config();

const axios = require("axios");

const User = require("../models/User");
const Order = require("../models/Order");

const usernamePasswordBuffer = Buffer.from(
  process.env.ASAP_KEY + ":" + process.env.ASAP_PASSWORD
);
const base64data = usernamePasswordBuffer.toString("base64");

exports.list = async (req, res) => {
  try {
    let aggregate_options = [];

    let page = parseInt(req.query.page) || 1;
    let limit = 10;

    const options = {
      page,
      limit,
      collation: { locale: "br" },
      customLabels: {
        totalDocs: "totalResults",
        docs: "events",
      },
    };

    // Filtering

    let match = {};

    const aggregate = Order.aggregate(aggregate_options);

    const result = await Order.aggregatePaginate(aggregate, options);

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

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
  try {
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
  } catch (error) {
    console.log(error);
  }
};
