import "./styles.scss";
import Icon from "../Icon";
import Image from "../Image";

function OrderView(props) {
  const paymentIcon = {
    "credit-card": <Image name="credit-card.png" id="order-payment-icon" />,
  };

  const paymentStatus = {
    paid: <p className="payment-status-paid">Pagamento confirmado</p>,
  };

  return (
    <>
      <div className="order-view-box">
        {props.clientImage ? (
          <img src={props.clientImage} className="order-view-client-image" />
        ) : (
          <Image name="user-avatar.svg" className="order-view-client-image" />
        )}
        <div className="information-column">
          <h1 className="order-view-client">{props.clientName}</h1>
          <div className="row client-contact-row">
            <p>{props.clientEmail}</p>
            <div className="order-view-circle" />
            <p>{props.clientNumber}</p>
          </div>
          <div className="row payment-row">
            {paymentIcon[props.paymentMethod]}
            <div className="order-payment-status-box">
              {props.paymentStatus ? (
                paymentStatus[props.paymentStatus]
              ) : (
                <p className="payment-status-loading">Carregando . . .</p>
              )}
            </div>
            <Icon
              name="list-button.png"
              id="order-view-list-button"
              onClick={() => props.showOrderDetails(props.postalInformation)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderView;
