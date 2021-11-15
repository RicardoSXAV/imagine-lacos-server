import { useState } from "react";

import Input from "../../UI/Input";
import FormWindow from "../FormWindow";

function AddPostalInformation({
  showAddWindow,
  setShowAddWindow,
  updateUserInformation,
}) {
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

  return (
    <FormWindow
      title="Adicionar dados postais"
      showWindow={showAddWindow}
      setShowWindow={setShowAddWindow}
      handleSubmit={() =>
        updateUserInformation({
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
  );
}

export default AddPostalInformation;
