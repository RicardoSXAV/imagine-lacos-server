require("dotenv").config();

const Gerencianet = require("gn-api-sdk-node");
const axios = require("axios");
const moment = require("moment");

const User = require("../models/User");
const Order = require("../models/Order");

const options = {
  sandbox: true,

  // Credenciais de Produção
  clientIdProducao: "",
  clientSecretProducao: "",
  pathCertProducao: "",

  // Credenciais de Homologação
  clientIdHomologacao: process.env.GERENCIANET_CLIENT_ID_H,
  clientSecretHomologacao: process.env.GERENCIANET_CLIENT_SECRET_H,
  pathCertHomologacao: "certificado-pix-homologacao.p12",
};

exports.creditCard = async (req, res) => {
  try {
    const { paymentToken } = req.params;
    const { userId } = req.userData;

    const user = await User.findById(userId);
    const billingAdress = {
      street: user.postalInformation.street,
      number: user.postalInformation.number,
      neighborhood: user.postalInformation.neighborhood,
      complement: user.postalInformation.complement,
      city: user.postalInformation.city,
      state: user.postalInformation.state,
      zipcode: user.postalInformation.zipcode,
    };
    const itemsArray = user.cartList.map((product) => ({
      name: product.productName,
      value: product.productPrice * 100,
      amount: product.productAmount,
    }));

    const body = {
      payment: {
        credit_card: {
          installments: 1,
          payment_token: paymentToken,
          billing_address: billingAdress,
          customer: {
            name: user.fullName,
            email: user.email,
            cpf: user.postalInformation.cpf,
            birth: user.postalInformation.birth,
            phone_number: user.postalInformation.phoneNumber,
          },
        },
      },

      items: itemsArray,

      shippings: [
        {
          name: "Default Shipping Cost",
          value: 100,
        },
      ],
    };

    const gerencianet = new Gerencianet(options);

    gerencianet
      .oneStep([], body)
      .then(async (response) => {
        const existingOrder = await Order.findOne({ userId });

        if (existingOrder) {
          return res.status(401).json({
            error: true,
            message: "Você já tem um pedido em andamento.",
          });
        }

        const newOrder = new Order({
          userId,
          postalInformation: user.postalInformation,
          products: itemsArray,
          paymentMethod: "credit-card",
          paymentInfo: {
            chargeId: response.charge_id,
          },
        });
        await newOrder.save();

        console.log(response);
      })
      .catch(console.log)
      .done();
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.bankingBillet = async (req, res) => {
  const { userId } = req.userData;
  const user = await User.findById(userId);
  const itemsArray = user.cartList.map((product) => ({
    name: product.productName,
    value: product.productPrice * 100,
    amount: product.productAmount,
  }));

  const dateFormat = "YYYY-MM-DD";
  const today = moment();

  const daysToAdd = today.day() + 3 >= 6 ? 2 : today.day() === 0 ? 1 : 0;

  const dayToPay = moment(today)
    .add(3 + daysToAdd, "days")
    .format(dateFormat);

  const body = {
    payment: {
      banking_billet: {
        expire_at: dayToPay,
        customer: {
          name: user.fullName,
          email: user.email,
          cpf: user.postalInformation.cpf,
          birth: user.postalInformation.birth,
          phone_number: user.postalInformation.phoneNumber,
        },
      },
    },

    items: itemsArray,
    shippings: [
      {
        name: "Default Shipping Cost",
        value: 100,
      },
    ],
  };

  var gerencianet = new Gerencianet(options);

  gerencianet
    .oneStep([], body)
    .then(async (response) => {
      try {
        const existingOrder = await Order.findOne({ userId });

        if (existingOrder) {
          return res.status(401).json({
            error: true,
            message: "Você já tem um pedido em andamento.",
          });
        }

        const newOrder = new Order({
          userId,
          postalInformation: user.postalInformation,
          products: itemsArray,
          paymentMethod: "banking-billet",
          paymentInfo: {
            expireAt: response.expire_at,
            link: response.link,
          },
        });
        await newOrder.save();
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({ error: false, info: response });
    })
    .catch(console.log)
    .done();
};

exports.pix = async (req, res) => {
  const gerencianet = new Gerencianet(options);

  const params = {
    id: 1432132,
  };

  gerencianet.detailCharge(params).then(console.log).catch(console.log).done();

  /* let body = {
    calendario: {
      expiracao: 3600,
    },
    devedor: {
      cpf: "94271564656",
      nome: "Gorbadock Oldbuck",
    },
    valor: {
      original: "123.45",
    },
    chave: "SUACHAVEPIX", // Informe sua chave Pix cadastrada na Gerencianet
    infoAdicionais: [
      {
        nome: "Pagamento em",
        valor: "NOME DO SEU ESTABELECIMENTO",
      },
      {
        nome: "Pedido",
        valor: "NUMERO DO PEDIDO DO CLIENTE",
      },
    ],
  };

  let gerencianet = new Gerencianet(options);

  gerencianet
    .pixCreateImmediateCharge([], body)
    .then((response) => console.log(response.loc.id))
    .catch(console.log)
    .done();

  gerencianet
    .pixGenerateQRCode({ id: "5" })
    .then(console.log)
    .catch(console.log)
    .done(); */
};
