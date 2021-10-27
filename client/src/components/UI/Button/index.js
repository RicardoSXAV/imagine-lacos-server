import "./styles.scss";

import Icon from "../../Icon";

function Button(props) {
  function renderButton(type) {
    if (type === "secondary") {
      return (
        <button type="button" className="btn btn-secondary" {...props}>
          <Icon
            name={props.iconName || "prev-button.png"}
            id="btn-secondary-icon"
          />
          {props.children}
        </button>
      );
    } else {
      return (
        <button type="button" className="btn btn-primary" {...props}>
          {props.children}
        </button>
      );
    }
  }

  return renderButton(props.buttonType);
}

export default Button;
