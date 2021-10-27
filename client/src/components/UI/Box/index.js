import "./styles.scss";

function Box(props) {
  return (
    <div className="box" {...props}>
      {props.children}
    </div>
  );
}

export default Box;
