import "./styles.scss";

import Button from "../UI/Button";

function PopupConfirmDelete(props) {
  return (
    <>
      <div className="popup-confirm-delete-box" {...props}>
        <h1>{props.children}</h1>
        <div className="button-row">
          <Button id="confirm-button" onClick={props.confirm}>
            Confirmar
          </Button>
          <Button id="cancel-button" onClick={props.cancel}>
            Cancelar
          </Button>
        </div>
      </div>

      <div className="background-blur" />
    </>
  );
}

export default PopupConfirmDelete;
