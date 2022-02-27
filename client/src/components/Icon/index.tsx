import React, { ReactHTMLElement } from "react";
import "./styles.scss";

function Icon(
  imageProps: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
) {
  return <img className="icon" {...imageProps} />;
}

export default Icon;
