import "./styles.scss";

import SignInForm from "../../components/Forms/SingInForm";
import Popup from "../../components/Popup";
import Footer from "../../components/Footer";

function Entrar(props) {
  return (
    <>
      <Popup
        showPopup={props.loginUserError}
        setShowPopup={props.setLoginUserError}
      >
        E-mail ou senha inválido.
      </Popup>
      <SignInForm
        loginUser={props.loginUser}
        loginUserWithGoogle={props.loginUserWithGoogle}
      />

      <Footer />
    </>
  );
}

export default Entrar;
