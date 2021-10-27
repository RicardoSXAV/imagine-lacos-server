import "./styles.scss";

import SignUpForm from "../../components/Forms/SignUpForm";
import Icon from "../../components/Icon";
import Badge from "../../components/UI/Badge";

function Registrar(props) {
  return (
    <div>
      <SignUpForm registerUser={props.registerUser} />
    </div>
  );
}

export default Registrar;
