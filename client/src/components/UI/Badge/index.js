import "./styles.scss";

function Badge(props) {
  return (
    <div className="badge-container">
      <div className="red-badge">
        {props.number > 99 ? (
          <p style={{ fontSize: "1.2rem", paddingTop: "9px" }}>99+</p>
        ) : (
          <p>{props.number}</p>
        )}
      </div>
      {props.children}
    </div>
  );
}

export default Badge;
