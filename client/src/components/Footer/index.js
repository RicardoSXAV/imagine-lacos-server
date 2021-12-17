import "./styles.scss";

import { Link } from "react-router-dom";

import Icon from "../Icon";

function Footer() {
  return (
    <div className="footer-box">
      <div className="footer-box-column">
        <h1>Redes Sociais</h1>

        <div className="footer-box-row">
          <Icon name="whatsapp.svg" />
          <Icon name="instagram.svg" />
        </div>
      </div>

      <div className="footer-box-column">
        <h1>Sobre</h1>
        <Link>Sobre a loja</Link>
        <Link>Reportar um erro</Link>
        <Link>Política de privacidade</Link>
      </div>

      <div className="footer-box-column" id="contact-column">
        <h1>Contato</h1>
        <a href="mailto:imaginelacoss@gmail.com">
          <Icon name="gmail.svg" />
        </a>
        <h2>(61) 99863-1756</h2>
      </div>
    </div>
  );
}

export default Footer;
