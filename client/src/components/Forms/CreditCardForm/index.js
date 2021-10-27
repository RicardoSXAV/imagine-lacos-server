import "./styles.scss";

import { useState } from "react";

import Image from "../../Image";
import Icon from "../../Icon";
import Button from "../../UI/Button";
import Input from "../../UI/Input";

function CreditCardForm(props) {
  const [brand, setBrand] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <div
      className="credit-card-form"
      style={props.showWindow ? { display: "flex" } : { display: "none" }}
    >
      <div className="form-box" {...props}>
        <h1 className="form-title">{props.title}</h1>
        <Icon
          name="x-button.png"
          id="form-x-button"
          onClick={() => props.setShowWindow(false)}
        />

        <div className="credit-card-box">
          <Input
            type="text"
            placeholder="Brand"
            id="credit-card-input-brand"
            onChange={(event) => setBrand(event.target.value)}
          />
          <Input
            type="text"
            placeholder="Número"
            id="credit-card-input-number"
            onChange={(event) => setNumber(event.target.value)}
          />
          <Input
            type="text"
            placeholder="MM/AA"
            id="credit-card-input-date"
            onChange={(event) => setDate(event.target.value)}
          />
          <Input
            type="text"
            placeholder="CVV"
            id="credit-card-input-cvv"
            onChange={(event) => setCvv(event.target.value)}
          />

          <Image name="cloud-with-tie.png" />
        </div>

        <div className="form-buttons">
          <Button
            id="form-confirm-button"
            onClick={() =>
              props.handleSubmit({
                brand,
                number,
                expirationMonth: date.slice(0, 2),
                expirationYear: "20" + date.slice(2),
                cvv,
              })
            }
          >
            Confirmar
          </Button>
          <Button
            onClick={() => props.setShowWindow(false)}
            id="form-cancel-button"
          >
            Cancelar
          </Button>
        </div>
      </div>
      <div className="background-blur"></div>
    </div>
  );
}

export default CreditCardForm;
