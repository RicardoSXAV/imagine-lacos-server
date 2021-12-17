import "./styles.scss";

import SignUpForm from "../../components/Forms/SignUpForm";
import Footer from "../../components/Footer";

function Registrar(props) {
  return (
    <>
      <SignUpForm registerUser={props.registerUser} />
      <Footer />
    </>
  );
}

export default Registrar;
