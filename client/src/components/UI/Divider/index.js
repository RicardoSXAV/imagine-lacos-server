import "./styles.scss";

function Divider(props) {
  return (
    <div className="divider" {...props}>
      <div className="separator"></div>
      <div className="divider-text">{props.children}</div>
      <div className="separator"></div>
    </div>
  );
}

export default Divider;
