import axios from "axios";

function Pagamento() {
  function creditPayment() {
    window.generatePaymentToken();
  }

  function billetPayment() {
    axios.post("http://localhost:5000/api/payment/billet");
  }

  function pixPayment() {
    axios.post("http://localhost:5000/api/payment/pix");
  }

  return (
    <div>
      <button onClick={creditPayment}>Pagar com cartão de crédito</button>
      <button onClick={billetPayment}>Pagar com boleto</button>
      <button onClick={pixPayment}>Pagar com PIX</button>
    </div>
  );
}

export default Pagamento;
