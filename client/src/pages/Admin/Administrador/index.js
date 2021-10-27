import "./styles.scss";

function Administrador(props) {
  return (
    <div>
      <button onClick={props.logoutUser}>Sair</button>
    </div>
  );
}

export default Administrador;
