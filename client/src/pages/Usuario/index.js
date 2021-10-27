import "./styles.scss";

import { useState } from "react";

import Navbar from "../../components/Navbar";
import Image from "../../components/Image";
import FormWindow from "../../components/Forms/FormWindow";
import Popup from "../../components/Popup";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

import zipcodeFormat from "../../utils/zipcodeFormat";

function Usuario(props) {
  const [showAddWindow, setShowAddWindow] = useState(false);
  const [showEditWindow, setShowEditWindow] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [cpf, setCpf] = useState("");
  const [birth, setBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  function getPostalInfoAndShowWindow() {
    setStreet(props.userData.postalInformation.street);
    setNumber(props.userData.postalInformation.number);
    setNeighborhood(props.userData.postalInformation.neighborhood);
    setComplement(props.userData.postalInformation.complement);
    setCity(props.userData.postalInformation.city);
    setState(props.userData.postalInformation.state);
    setZipcode(props.userData.postalInformation.zipcode);
    setCpf(props.userData.postalInformation.cpf);
    setBirth(props.userData.postalInformation.birth);
    setPhoneNumber(props.userData.postalInformation.phoneNumber);

    setShowEditWindow(true);
  }

  function handleEditFormSubmit() {
    if (
      JSON.stringify(props.userData.postalInformation) ===
      JSON.stringify({
        street,
        number,
        neighborhood,
        complement,
        city,
        state,
        zipcode,
        cpf,
        birth,
        phoneNumber,
      })
    ) {
      console.log("os dois objetos são iguais");

      return;
    }

    props.updateUserInformation({
      postalInformation: {
        street,
        number,
        neighborhood,
        complement,
        city,
        state,
        zipcode,
        cpf,
        birth,
        phoneNumber,
      },
    });
  }

  return (
    <>
      <Popup showPopup={showHelpPopup} setShowPopup={setShowHelpPopup}>
        Precisa de ajuda?
      </Popup>

      <FormWindow
        title="Adicionar dados postais"
        showWindow={showAddWindow}
        setShowWindow={setShowAddWindow}
        handleSubmit={() =>
          props.updateUserInformation({
            postalInformation: {
              street,
              number,
              neighborhood,
              complement,
              city,
              state,
              zipcode,
              cpf,
              birth,
              phoneNumber,
            },
          })
        }
      >
        <Input
          type="text"
          placeholder="Rua"
          label="Nome da Rua"
          onChange={(event) => setStreet(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Número"
          label="Número"
          onChange={(event) => setNumber(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Bairro"
          label="Bairro"
          onChange={(event) => setNeighborhood(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Complemento"
          label="Complemento"
          onChange={(event) => setComplement(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Cidade"
          label="Cidade"
          onChange={(event) => setCity(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Estado"
          label="Estado"
          onChange={(event) => setState(event.target.value)}
        />
        <Input
          type="text"
          placeholder="CEP"
          label="CEP"
          onChange={(event) => setZipcode(event.target.value)}
        />
        <Input
          type="text"
          placeholder="CPF"
          label="CPF"
          onChange={(event) => setCpf(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Data de Nascimento"
          label="Data de Nascimento"
          onChange={(event) => setBirth(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Número de Telefone"
          label="Número de Telefone"
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </FormWindow>

      <FormWindow
        editForm
        title="Editar dados postais"
        showWindow={showEditWindow}
        setShowWindow={setShowEditWindow}
        handleSubmit={handleEditFormSubmit}
      >
        <Input
          type="text"
          placeholder="Rua"
          label="Nome da Rua"
          value={street}
          onChange={(event) => setStreet(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Número"
          label="Número"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Bairro"
          label="Bairro"
          value={neighborhood}
          onChange={(event) => setNeighborhood(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Complemento"
          label="Complemento"
          value={complement}
          onChange={(event) => setComplement(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Cidade"
          label="Cidade"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Estado"
          label="Estado"
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
        <Input
          type="text"
          placeholder="CEP"
          label="CEP"
          value={zipcode}
          onChange={(event) => setZipcode(event.target.value)}
        />
        <Input
          type="text"
          placeholder="CPF"
          label="CPF"
          value={cpf}
          onChange={(event) => setCpf(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Data de Nascimento"
          label="Data de Nascimento"
          value={birth}
          onChange={(event) => setBirth(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Número de Telefone"
          label="Número de Telefone"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </FormWindow>

      <div className="user-page">
        <Navbar
          userPage
          userData={props.userData}
          logoutUser={props.logoutUser}
        />

        <div className="user-page-container">
          <div className="user-information-box">
            <div className="flex-wrapper">
              {props.userData.profileImage ? (
                <button className="user-profile-image">
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
                <button className="user-profile-no-image">
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
                <h1 className="user-profile-name">{props.userData.name}</h1>

                {JSON.stringify(props.userData.postalInformation) !== "{}" ? (
                  <div className="user-profile-postal-info">
                    <Image name="mailbox.png" />
                    <p className="user-profile-local">
                      {props.userData.postalInformation.city},{" "}
                      {props.userData.postalInformation.state}
                    </p>
                    <div className="user-profile-zipcode">
                      <div className="user-profile-zipcode-circle" />
                      {zipcodeFormat(props.userData.postalInformation.zipcode)}
                    </div>
                  </div>
                ) : (
                  <p className="user-no-postal-info">
                    Você ainda não cadastrou os dados postais.
                  </p>
                )}
              </div>
            </div>
          </div>

          {JSON.stringify(props.userData.postalInformation) === "{}" ? (
            <Button
              id="add-postal-information"
              onClick={() => {
                window.scrollTo(0, 0);
                setShowAddWindow(true);
              }}
            >
              Adicionar dados postais
            </Button>
          ) : (
            <Button
              id="edit-postal-information"
              onClick={() => {
                window.scrollTo(0, 0);
                getPostalInfoAndShowWindow();
              }}
            >
              Editar dados postais
            </Button>
          )}

          <div className="flex-wrapper">
            <div className="user-configuration-box">
              <Image name="config-icon.png" />
              <Button id="edit-user-profile">Editar perfil</Button>
              <Button id="delete-user-account">Deletar a conta</Button>
            </div>
            <div className="user-options-box">
              <div className="user-options-icons">
                <div className="flex-wrapper-column">
                  <div className="user-options-icon-box">
                    <Image name="shopping-bag.png" />
                  </div>
                  <h3>Pedidos</h3>
                </div>
                <div className="flex-wrapper-column">
                  <div
                    className="user-options-icon-box"
                    onClick={() => setShowHelpPopup(true)}
                  >
                    <Image name="help-ballon.png" />
                  </div>
                  <h3>Ajuda</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Usuario;
