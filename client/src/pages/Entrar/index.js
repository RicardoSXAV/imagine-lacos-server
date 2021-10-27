import "./styles.scss";

import SignInForm from "../../components/Forms/SingInForm";

function Entrar(props) {
  return (
    <>
      <SignInForm
        loginUser={props.loginUser}
        loginUserWithGoogle={props.loginUserWithGoogle}
      />
    </>
  );
}

export default Entrar;
