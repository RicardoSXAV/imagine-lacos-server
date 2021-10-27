import "./styles.scss";

import { useState, useEffect } from "react";
import axios from "axios";

function Verificacao(props) {
  const [response, setResponse] = useState("");

  useEffect(() => {
    async function verifyUser(token) {
      await axios
        .get("http://localhost:5000/api/user/verify/" + token)
        .then((response) => setResponse(response.data.message))
        .catch((error) => console.log(error.response));
    }

    verifyUser(props.match.params.token);
  }, []);

  return <div>{response}</div>;
}

export default Verificacao;
