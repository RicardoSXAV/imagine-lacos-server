require("dotenv").config();
const axios = require("axios");

const usernamePasswordBuffer = Buffer.from(
  process.env.ASAP_KEY + ":" + process.env.ASAP_PASSWORD
);
const base64data = usernamePasswordBuffer.toString("base64");

exports.getShippingCost = async (zipcode) => {
  try {
    const response = await axios.get(
      `https://app.asaplog.com.br/webservices/v1/consultarFrete?peso=1&valor=20&cep=${zipcode}&altura=50&largura=50&profundidade=50`,
      { headers: { Authorization: `Basic ${base64data}` } }
    );

    return response.data.preco;
  } catch (error) {
    return { error: true };
  }
};
