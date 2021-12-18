import "./styles.scss";

import Icon from "../Icon";

function Popup(props) {
  return (
    <>
      <div
        className="popup"
        style={props.showPopup ? { display: "block" } : { display: "none" }}
        {...props}
      >
        <div className="popup-window" {...props}>
          <Icon
            name="x-button.png"
            id="popup-x-button"
            onClick={() => props.setShowPopup(false)}
          />
          {props.children}
        </div>
      </div>
      <div
        className="background-blur"
        style={props.showPopup ? { display: "block" } : { display: "none" }}
      />
    </>
  );
}

export default Popup;
