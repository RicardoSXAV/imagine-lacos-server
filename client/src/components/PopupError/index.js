import "./styles.scss";

import Icon from "../Icon";

function PopupError(props) {
  return (
    <>
      <div className="popup-error-box">
        <div className="close-line">
          <Icon
            name="x-button.png"
            id="popup-error-x-button"
            onClick={() => props.setErrorMessage("")}
          />
        </div>
        {Array.isArray(props.children) ? (
          <ul>
            {props.children.map((error) => (
              <li>{error}</li>
            ))}
          </ul>
        ) : (
          <p>{props.children}</p>
        )}
      </div>
      <div className="background-blur" />
    </>
  );
}

export default PopupError;
