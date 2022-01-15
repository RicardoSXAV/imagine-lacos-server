import "./styles.scss";

import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import priceFormatter from "../../utils/priceFormatter";

import Navbar from "../../components/Navbar";
import Icon from "../../components/Icon";
import CreditCardForm from "../../components/Forms/CreditCardForm";
import Image from "../../components/Image";
import AddPostalInformation from "../../components/Forms/AddPostalInformation";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import Box from "../../components/UI/Box";

function Carrinho(props) {
  const [showAddWindow, setShowAddWindow] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("Cartão");
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState(
    props.userData?.cartList.map((product) => ({
      productId: product.productId,
      productAmount: product.productAmount,
      productPrice: product.productPrice,
    }))
  );
  const [shippingPrice, setShippingPrice] = useState(0);

  const history = useHistory();

  useEffect(() => {
    // Calcular o preço do frete
    axios
      .get("http://localhost:5000/api/order/shipping-price")
      .then((response) => {
        setShippingPrice(response.data.price);
      });
  }, []);

  const checkoutTotalAmount = checkoutProducts
    .map((product) => product.productAmount)
    .reduce((prev, next) => prev + next, 0);

  const checkoutTotalPrice = checkoutProducts
    .map((product) => product.productPrice * product.productAmount)
    .reduce((prev, next) => prev + next, 0);

  function updateCheckoutProducts(value, info) {
    const filteredArray = checkoutProducts.filter(
      (product) => product.productId !== info
    );

    const updatedObject = checkoutProducts.find(
      (product) => product.productId === info
    );

    updatedObject.productAmount = value;

    const newArray = [updatedObject, ...filteredArray];
    setCheckoutProducts(newArray);
  }

  function handlePaymentChoose() {
    if (paymentMethod === "Cartão") {
      setShowCreditCardForm(true);
    }
    if (paymentMethod === "Boleto") {
      handleBilletPayment();
    }
    if (paymentMethod === "PIX") {
      handlePixPayment();
    }
  }

  function handleCreditCardPayment(object) {
    console.log(object);

    window.generatePaymentToken(object);

    setShowCreditCardForm(false);
  }

  function handleBilletPayment() {
    axios
      .post("http://localhost:5000/api/payment/billet", {})
      .then((response) => console.log(response))
      .catch((error) => console.log(error.message));
  }

  function handlePixPayment() {
    axios.post("http://localhost:5000/api/payment/pix", {});
  }

  return (
    <>
      <CreditCardForm
        title="Pagamento"
        showWindow={showCreditCardForm}
        setShowWindow={setShowCreditCardForm}
        handleSubmit={handleCreditCardPayment}
      />

      <AddPostalInformation
        showAddWindow={showAddWindow}
        setShowAddWindow={setShowAddWindow}
        updateUserInformation={props.updateUserInformation}
      />

      <div className="cart-page">
        <Navbar user userData={props.userData} />

        {props.userData?.cartList.length > 0 && (
          <div className="cart-page-title-box">
            <h1>Seu carrinho</h1>
          </div>
        )}

        {props.userData.cartList.map((product, index) => (
          <div className="cart-product-card">
            <img
              className="cart-product-image"
              src={product.productImage}
              alt={product.productName}
              onClick={() => history.push(`/produto/${product.productId}`)}
            />
            <div className="cart-product-info">
              <h1 className="product-name">{product.productName}</h1>
              <h1 className="product-price">
                {priceFormatter.format(product.productPrice)}
              </h1>
            </div>
            <Input
              type="step-number"
              info={product.productId}
              step={1}
              min={1}
              max={product.productMaxQuantity}
              onValueChange={updateCheckoutProducts}
            />
            <Icon
              name="x-button.png"
              id="remove-cart-product-icon"
              onClick={() => props.removeFromCart(product.productId)}
            />
          </div>
        ))}

        {props.userData?.cartList.length > 0 &&
        JSON.stringify(props.userData?.postalInformation) !== "{}" ? (
          <div className="cart-payment-box">
            <div className="cart-payment-price-table">
              <table>
                <tr>
                  <th>Produtos</th>
                  <th>Frete</th>
                  <th>Total</th>
                </tr>
                <tr>
                  <td>{priceFormatter.format(checkoutTotalPrice)}</td>
                  <td>{priceFormatter.format(shippingPrice)}</td>
                  <td>
                    {priceFormatter.format(checkoutTotalPrice + shippingPrice)}
                  </td>
                </tr>
              </table>
            </div>
            <div className="cart-payment-total-items">
              <div className="cart-payment-total-circle"></div>
              {checkoutTotalAmount} itens.
            </div>
            <div className="container-row">
              <Input
                type="select"
                selectWithImages={{
                  background:
                    "linear-gradient(179.86deg, #93EBA7 0.12%, #E9FFFE 99.88%)",
                  imagesName: [
                    "credit-card.png",
                    "bank-slip.png",
                    "pix-icon.png",
                  ],
                }}
                placeholder="Pagamento"
                options={["Cartão", "Boleto", "PIX"]}
                setOption={setPaymentMethod}
                selectedOption={paymentMethod}
              />
              <Button onClick={() => handlePaymentChoose()}>Comprar</Button>
            </div>
          </div>
        ) : JSON.stringify(props.userData?.postalInformation) === "{}" ? (
          <div className="box-no-postal-info">
            <Image name="bow-tie.svg" />
            <p>Você ainda não cadastrou seus dados postais.</p>
            <p>Clique abaixo para adicionar.</p>
            <Button
              id="cart-add-postal-info"
              onClick={() => setShowAddWindow(true)}
            >
              Adicionar dados postais
            </Button>
          </div>
        ) : (
          <div className="empty-cart-list-container">
            <Box id="empty-cart-box">
              <h1>Seu carrinho está vazio!</h1>
              <Image name="gift-with-hearts.png" />
              <Button
                onClick={() => {
                  history.push("/");
                  window.scrollTo(0, 0);
                }}
              >
                Ir às compras
              </Button>
            </Box>
          </div>
        )}
      </div>
    </>
  );
}

export default Carrinho;
