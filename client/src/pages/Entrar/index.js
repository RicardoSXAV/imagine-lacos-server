import "./styles.scss";

import SignInForm from "../../components/Forms/SingInForm";
import PopupError from "../../components/PopupError";
import Footer from "../../components/Footer";

function Entrar(props) {
  return (
    <>
      {props.errorMessage && (
        <PopupError setErrorMessage={props.setErrorMessage}>
          {props.errorMessage}
        </PopupError>
      )}

      <SignInForm
        loginUser={props.loginUser}
        loginUserWithGoogle={props.loginUserWithGoogle}
      />

      <Footer />
    </>
  );
}

export default Entrar;
