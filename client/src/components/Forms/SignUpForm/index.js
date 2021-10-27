import "./styles.scss";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import Box from "../../UI/Box";
import Input from "../../UI/Input";
import Button from "../../UI/Button";
import Divider from "../../UI/Divider";
import Image from "../../Image";
import Icon from "../../Icon";

function SignUpForm(props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const history = useHistory();

  function handleFormSubmit() {
    props.registerUser({ fullName, email, password, confirmPassword });
  }

  return (
    <>
      <Icon
        name="top-logo-no-tie.png"
        id="sign-up-logo"
        onClick={() => history.push("/")}
      />
      <div className="sign-up-form">
        <Image name="bow-tie.svg" id="sign-up-tie-icon" />
        <Box id="sign-up-box">
          <h1 className="h1-form">Seja bem-vindo(a)!</h1>
          <Button>
            <Icon name="google-button.png" id="sign-in-with-google-icon" />
            Entrar com o Google
          </Button>

          <Divider id="sign-up-form-divider">ou</Divider>

          <Input
            type="text"
            placeholder="Nome completo"
            onChange={(event) => setFullName(event.target.value)}
          />
          <Input
            type="text"
            placeholder="Endereço de e-mail"
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirmar senha"
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <Button id="register-button" onClick={handleFormSubmit}>
            Registrar
          </Button>
        </Box>
      </div>
    </>
  );
}

export default SignUpForm;
