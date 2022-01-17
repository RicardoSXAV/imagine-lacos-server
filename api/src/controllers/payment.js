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

exports.status = async (req, res) => {
  try {
    const { chargeId } = req.params;

    const gerencianet = new Gerencianet(options);

    const params = {
      id: chargeId,
    };

    gerencianet
      .detailCharge(params)
      .then((response) => {
        return res.status(200).json({ error: false, status: response.status });
      })
      .catch(console.log);
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.pixStatus = async (req, res) => {
  try {
    const { txId } = req.params;
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.pixQRCode = async (req, res) => {
  try {
    const { locId } = req.params;
    const gerencianet = new Gerencianet(options);

    const qrCodeInfo = await gerencianet.pixGenerateQRCode({
      id: locId,
    });

    if (qrCodeInfo) {
      return res.status(200).json({ error: false, data: qrCodeInfo });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
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
          userInfo: {
            name: user.fullName,
            profileImage: user.profileImage,
            email: user.email,
            phoneNumber: user.postalInformation.phoneNumber,
          },
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
  try {
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
            userInfo: {
              name: user.fullName,
              profileImage: user.profileImage,
              email: user.email,
              phoneNumber: user.postalInformation.phoneNumber,
            },
            postalInformation: user.postalInformation,
            products: itemsArray,
            paymentMethod: "banking-billet",
            paymentInfo: {
              expireAt: response.expire_at,
              link: response.link,
              chargeId: response.charge_id,
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
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.pix = async (req, res) => {
  try {
    const { userId } = req.userData;
    const user = await User.findById(userId);

    const existingOrder = await Order.findOne({ userId });

    if (existingOrder) {
      return res.status(401).json({
        error: true,
        message: "Você já tem um pedido em andamento.",
      });
    }

    const itemsArray = user.cartList.map((product) => ({
      name: product.productName,
      value: product.productPrice * 100,
      amount: product.productAmount,
    }));

    const totalPrice = user.cartList
      .map((product) => product.productPrice)
      .reduce((prev, current) => prev + current, 0)
      .toFixed(2);

    const gerencianet = new Gerencianet(options);

    let body = {
      calendario: {
        expiracao: 3600,
      },
      devedor: {
        cpf: user.postalInformation.cpf,
        nome: user.fullName,
      },
      valor: {
        original: totalPrice,
      },
      chave: "e8d0926f-6360-4620-a79a-8f030458f343",
      infoAdicionais: [
        {
          nome: "Pagamento em",
          valor: "Imagine Laços",
        },
      ],
    };

    gerencianet
      .pixCreateImmediateCharge([], body)
      .then(async (response) => {
        console.log("response", response);
        console.log("loc.id", response.loc.id);

        /* const qrCodeInfo = await gerencianet.pixGenerateQRCode({
          id: response.loc.id,
        });

        console.log("qr", qrCodeInfo); */

        const newOrder = new Order({
          userId,
          userInfo: {
            name: user.fullName,
            profileImage: user.profileImage,
            email: user.email,
            phoneNumber: user.postalInformation.phoneNumber,
          },
          postalInformation: user.postalInformation,
          products: itemsArray,
          paymentMethod: "pix",
          paymentInfo: {
            txId: response.txid,
            locId: response.loc.id,
            // qrCodeInfo,
          },
        });

        await newOrder.save();
      })
      .catch(console.log)
      .done();

    /* gerencianet
      .pixGenerateQRCode({ id: "5" })
      .then(console.log)
      .catch(console.log)
      .done(); */
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
