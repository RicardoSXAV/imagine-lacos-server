import "./styles.scss";

import Icon from "../Icon";
import Image from "../Image";
import zipcodeFormat from "../../utils/zipcodeFormat";

function OrderDetails(props) {
  const hasOrderDetails = JSON.stringify(props.orderDetails) !== "{}";

  return (
    <>
      <div
        style={hasOrderDetails ? { opacity: 1 } : { opacity: 0 }}
        className="order-details-box"
      >
        <h1 className="order-details-title">Detalhes do Pedido</h1>

        <div className="order-details-information-box">
          <div className="information-row">
            <Image name="mailbox.png" id="mailbox-image" />
            <strong>
              {props.orderDetails?.city}, {props.orderDetails?.state}
            </strong>
            <div className="information-circle" />
            <p>{zipcodeFormat(props.orderDetails?.zipcode)}</p>
          </div>
          <div className="information-row">
            <strong>Bairro: </strong>
            <p>{props.orderDetails?.neighborhood}</p>
          </div>
          <div className="information-row">
            <strong>Rua: </strong>
            <p>{props.orderDetails?.street}</p>
          </div>
          <div className="information-row">
            <strong>Número: </strong>
            <p>{props.orderDetails?.number}</p>
          </div>
          <div className="information-row">
            <strong>Complemento: </strong>
            <p>{props.orderDetails?.complement}</p>
          </div>
        </div>
        <Icon
          name="x-button.png"
          id="order-details-x-button"
          onClick={() => props.setOrderDetails({})}
        />
      </div>
      <div
        className="background-blur"
        style={hasOrderDetails ? { display: "block" } : { display: "none" }}
      />
    </>
  );
}

export default OrderDetails;
