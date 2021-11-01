import "./styles.scss";
import { useState } from "react";

import FormWindow from "../../../components/Forms/FormWindow";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Box from "../../../components/UI/Box";
import ProductCard from "../../../components/ProductCard";
import Navbar from "../../../components/Navbar";

function Produtos(props) {
  const [showWindow, setShowWindow] = useState(false);

  const [productCategory, setProductCategory] = useState(
    props.categoryList[0]?.name
  );
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);

  function resetForm() {
    setShowWindow(false);
    setProductCategory(props.categoryList[0]?.name);
    setProductName("");
    setProductPrice(0);
    setProductQuantity(0);
    setProductDescription("");
    setProductImages([]);
  }

  return (
    <>
      <FormWindow
        title="Novo produto"
        showWindow={showWindow}
        setShowWindow={setShowWindow}
        handleSubmit={() => {
          props.createProduct({
            productCategory,
            productName,
            productPrice,
            productQuantity,
            productDescription,
            productImages,
          });
          resetForm();
        }}
      >
        <Input
          type="text"
          placeholder="Nome do produto"
          label="Nome"
          onChange={(event) => setProductName(event.target.value)}
        />
        <Input
          type="number"
          placeholder="00,00"
          step="0.5"
          min="0"
          onChange={(event) => setProductPrice(event.target.value)}
        />
        <Input
          type="step-number"
          step={1}
          min={0}
          max={100}
          number={productQuantity}
          changeNumber={setProductQuantity}
        />
        <Input
          type="select"
          placeholder="Categoria"
          label="Categoria"
          options={props.categoryList.map((category) => category.name)}
          setOption={setProductCategory}
          selectedOption={productCategory}
        />
        <Input
          type="text-area"
          rows="5"
          placeholder="Descreva o produto"
          onChange={(event) => setProductDescription(event.target.value)}
        />
        <Input
          type="multiple-images"
          onChange={(event) => setProductImages(event.target.files)}
        />
      </FormWindow>

      <div>
        <Navbar admin userData={props.userData} />
        <Button onClick={() => setShowWindow(true)}>
          Adicionar um produto
        </Button>
        <Box>
          <div className="products-list">
            {props.productList.map((product) => (
              <ProductCard
                admin
                title={product.name}
                category={product.category}
                categoryId={product.categoryId}
                price={product.price}
                quantity={product.quantity}
                id={product._id}
                remove={props.removeProduct}
              >
                <img src={product.images[0]} alt="" />
              </ProductCard>
            ))}
          </div>
        </Box>
      </div>
    </>
  );
}

export default Produtos;
