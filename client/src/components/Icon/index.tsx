import React from "react";
import "./styles.scss";

function Icon(
  imageProps: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) {
  return <img className="pressable-icon" {...imageProps} />;
}

export default Icon;
