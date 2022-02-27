import "./styles.scss";

import { useHistory } from "react-router";

import Icon from "../Icon";
import Button from "../UI/Button";
import Badge from "../UI/Badge";
import {
  barGraph,
  bowTiePlus,
  boxWithHeart,
  emptyCart,
  fullCart,
  topLogo,
  userAvatar,
} from "../../assets";

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
        src={userAvatar}
        onClick={() =>
          history.push(`${props.admin ? "/administrador" : "/usuario"}`)
        }
      />
    );
  }

  return (
    <div className="navbar">
      <div className="navbar-box">
        <Icon src={topLogo} id="home-logo" onClick={() => history.push("/")} />

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
                src={barGraph}
                id="navbar-bar-graph"
                onClick={() => history.push("/estatisticas")}
              />
              <Icon
                src={bowTiePlus}
                id="navbar-bow-tie-plus"
                onClick={() => history.push("/produtos")}
              />
              <Icon
                src={boxWithHeart}
                onClick={() => history.push("/pedidos")}
              />
            </>
          )}

          {(props.userPage || props.adminPage) && (
            <Button id="user-page-logout-button" onClick={props.logoutUser}>
              Sair
            </Button>
          )}

          {(props.user || props.admin) && renderUserAvatar()}

          {(props.user || props.userPage) && (
            <Badge number={props.userData?.cartList.length}>
              {props.userData?.cartList.length > 0 ? (
                <Icon
                  src={fullCart}
                  alt="Carrinho cheio"
                  onClick={() => history.push("/carrinho")}
                />
              ) : (
                <Icon
                  src={emptyCart}
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
