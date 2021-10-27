import "./styles.scss";

import { useHistory } from "react-router";

import Icon from "../Icon";
import Image from "../Image";
import Button from "../UI/Button";
import Badge from "../UI/Badge";

function Navbar(props) {
  const history = useHistory();

  function renderUserAvatar() {
    if (props.userData?.profileImage) {
      return (
        <img
          src={props.userData.profileImage}
          className="navbar-image-avatar"
          onClick={() =>
            history.push(`${props.admin ? "/administrador" : "/usuario"}`)
          }
        />
      );
    }

    return (
      <Icon
        name="user-avatar.svg"
        onClick={() =>
          history.push(`${props.admin ? "/administrador" : "/usuario"}`)
        }
      />
    );
  }

  return (
    <div className="navbar">
      <div className="navbar-box">
        <Icon
          name="top-logo.png"
          id="home-logo"
          onClick={() => history.push("/")}
        />

        {props.homePage && (
          <div className="navbar-buttons">
            <Button onClick={() => history.push("/entrar")}>Entrar</Button>
            <Button onClick={() => history.push("/registrar")}>
              Registrar
            </Button>
          </div>
        )}

        <div className="left-icons-container">
          {props.admin && (
            <>
              <Icon
                name="bar-graph.svg"
                onClick={() => history.push("/estatisticas")}
              />
              <Icon
                name="bow-tie-plus.svg"
                onClick={() => history.push("/produtos")}
              />
              <Icon
                name="box-with-heart.svg"
                onClick={() => history.push("/pedidos")}
              />
            </>
          )}

          {props.userPage && (
            <Button id="user-page-logout-button" onClick={props.logoutUser}>
              Sair
            </Button>
          )}

          {(props.user || props.admin) && renderUserAvatar()}

          {(props.user || props.userPage) && (
            <Badge number={props.userData?.cartList.length}>
              {props.userData?.cartList.length > 0 ? (
                <Icon
                  name="full-cart.svg"
                  alt="Carrinho cheio"
                  onClick={() => history.push("/carrinho")}
                />
              ) : (
                <Icon
                  name="empty-cart.svg"
                  alt="Carrinho vazio"
                  onClick={() => history.push("/carrinho")}
                />
              )}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
