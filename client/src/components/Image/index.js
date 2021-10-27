import "./styles.scss";

function Image(props) {
  function renderImage() {
    if (props.path) {
      return <img className="image" src={props.path} {...props} />;
    } else {
      return (
        <img
          className="image"
          src={require(`../../assets/images/${props.name}`).default}
          {...props}
        />
      );
    }
  }

  return renderImage();
}

export default Image;
