import "./styles.scss";
import { useState } from "react";

import Icon from "../Icon";

function ImageViewer(props) {
  const [focusMode, setFocusMode] = useState("");

  function scrollLeft() {
    document.querySelector(".image-viewer-container").scrollBy(-600, 0);
  }

  function scrollRight() {
    document.querySelector(".image-viewer-container").scrollBy(600, 0);
  }

  function imageFocus(event) {
    const imageSrc = event.target.children[0].currentSrc;
    setFocusMode(imageSrc);
  }

  return (
    <>
      <div
        className="image-viewer-focus"
        style={focusMode ? { display: "block" } : { display: "none" }}
      >
        <Icon
          name="x-button.png"
          id="image-viewer-focus-close"
          onClick={() => setFocusMode("")}
        />
        <img src={focusMode} className="image-viewer-focus-image" />
        <div className="background-blur" onClick={() => setFocusMode("")} />
      </div>
      <div className="image-viewer">
        <Icon
          name="prev-button.png"
          id="image-viewer-prev-button"
          onClick={scrollLeft}
        />
        <div className="image-viewer-container">
          {props.images.map((imageUrl) => (
            <div className="image-viewer-gradient" onClick={imageFocus}>
              <img src={imageUrl} className="image-viewer-img" />
            </div>
          ))}
        </div>
        <Icon
          name="next-button.png"
          id="image-viewer-next-button"
          onClick={scrollRight}
        />
      </div>
    </>
  );
}

export default ImageViewer;
