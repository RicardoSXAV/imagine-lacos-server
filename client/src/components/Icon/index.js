import "./styles.scss";

function Icon(props) {
  return (
    <img
      id={props.id}
      className="icon"
      src={require(`../../assets/icons/${props.name}`).default}
      alt={props.alt}
      onClick={props.onClick}
    />
  );
}

export default Icon;
