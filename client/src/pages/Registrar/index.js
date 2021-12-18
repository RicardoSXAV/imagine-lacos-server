import "./styles.scss";

import SignUpForm from "../../components/Forms/SignUpForm";
import Footer from "../../components/Footer";
import PopupError from "../../components/PopupError";

function Registrar(props) {
  return (
    <>
      {props.errorMessage && (
        <PopupError setErrorMessage={props.setErrorMessage}>
          {props.errorMessage}
        </PopupError>
      )}

      <SignUpForm registerUser={props.registerUser} />
      <Footer />
    </>
  );
}

export default Registrar;
