import "./styles.scss";
import { useState } from "react";

import Icon from "../Icon";

function Popup(props) {
  return (
    <div
      className="popup"
      style={props.showPopup ? { display: "block" } : { display: "none" }}
    >
      <div className="popup-window">
        <Icon name="x-button.png" onClick={() => props.setShowPopup(false)} />
        {props.children}
      </div>
      <div className="background-blur" />
    </div>
  );
}

export default Popup;
