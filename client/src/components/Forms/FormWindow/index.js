import "./styles.scss";
import { useState } from "react";
import Icon from "../../Icon";
import Button from "../../UI/Button";

function FormWindow(props) {
  const completeClass = props.editForm ? "-edit" : "";

  return (
    <div
      className="form-window"
      style={props.showWindow ? { display: "block" } : { display: "none" }}
    >
      <div className={"form-box" + completeClass} {...props}>
        <div className="form-box-overflow">
          <h1 className="form-title">{props.title}</h1>
          <Icon
            name="x-button.png"
            id="form-x-button"
            onClick={() => props.setShowWindow(false)}
          />

          {props.children}
        </div>
        <div className="form-buttons">
          <Button id="form-confirm-button" onClick={props.handleSubmit}>
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
      <div className="background-blur" />
    </div>
  );
}

export default FormWindow;
