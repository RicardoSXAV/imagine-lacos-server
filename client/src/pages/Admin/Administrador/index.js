import "./styles.scss";

import Navbar from "../../../components/Navbar";
import Image from "../../../components/Image";
import Popup from "../../../components/Popup";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";

function Administrador(props) {
  return (
    <div className="admin-page">
      <Navbar
        adminPage
        userData={props.userData}
        logoutUser={props.logoutUser}
      />

      <div className="admin-page-container">
        <div className="admin-information-box">
          <div className="flex-wrapper">
            {props.userData?.profileImage ? (
              <button className="admin-profile-image">
                {!props.userData.googleId && (
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={(event) =>
                      props.updateUserProfileImage({
                        profileImage: event.target.files[0],
                      })
                    }
                  />
                )}
                <img
                  src={props.userData.profileImage.replace("s96-c", "s394-c")}
                />
              </button>
            ) : (
              <button className="admin-profile-no-image">
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={(event) =>
                    props.updateUserProfileImage({
                      profileImage: event.target.files[0],
                    })
                  }
                />
                <Image name="camera.png" />
              </button>
            )}
            <div className="flex-column-wrapper">
              <h1 className="admin-profile-name">{props.userData.name}</h1>

              <p className="admin-warn">Você é um administrador!</p>
            </div>
          </div>
        </div>

        <div className="flex-wrapper">
          <div className="admin-configuration-box">
            <Image name="config-icon.png" />
            <Button id="edit-admin-profile">Editar perfil</Button>
            <Button id="delete-admin-account">Deletar a conta</Button>
          </div>
          <div className="admin-options-box">
            <div className="admin-options-icons">
              <div className="flex-wrapper-column">
                <div className="admin-options-icon-box">
                  <Image name="users-avatar.png" />
                </div>
                <h3>Usuários</h3>
              </div>
              <div className="flex-wrapper-column">
                <div className="admin-options-icon-box">
                  <Image name="tools.png" />
                </div>
                <h3>Ajustes</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Administrador;
