import "./styles.scss";
import Icon from "../Icon";
import Image from "../Image";

function OrderView(props) {
  const paymentIcon = {
    "credit-card": <Image name="credit-card.png" id="order-payment-icon" />,
  };

  return (
    <div className="order-view-box">
      {props.clientImage ? (
        <img src={props.clientImage} className="order-view-client-image" />
      ) : (
        <Image name="user-avatar.svg" className="order-view-client-image" />
      )}
      <h1 className="order-view-client">{props.clientName}</h1>
      <p>{props.clientEmail}</p>
      <p>{props.clientNumber}</p>
      <Icon name="list-button.png" />
      {paymentIcon[props.paymentMethod]}
    </div>
  );
}

export default OrderView;
