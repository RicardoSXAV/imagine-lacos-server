import "./styles.scss";
import { useState, useEffect } from "react";

import FormWindow from "../../../components/Forms/FormWindow";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Box from "../../../components/UI/Box";
import ProductCard from "../../../components/ProductCard";
import Navbar from "../../../components/Navbar";
import Pagination from "../../../components/Pagination";
import PopupConfirmDelete from "../../../components/PopupConfirmDelete";
import Image from "../../../components/Image";

function Produtos(props) {
  const [showWindow, setShowWindow] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  function confirmDelete() {
    props.removeProduct(deleteId);
    setShowDeleteConfirmation(false);
    setDeleteId("");
  }

  function cancelDelete() {
    setShowDeleteConfirmation(false);
    setDeleteId("");
  }

  useEffect(() => {
    if (showWindow || showDeleteConfirmation) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [showWindow, showDeleteConfirmation]);

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

      {showDeleteConfirmation && (
        <PopupConfirmDelete confirm={confirmDelete} cancel={cancelDelete}>
          Tem certeza que deseja remover esse produto?
        </PopupConfirmDelete>
      )}

      <div className="products-page">
        <Navbar admin userData={props.userData} />

        <div className="products-page-container">
          <Button onClick={() => setShowWindow(true)} id="add-products-button">
            Adicionar um produto
          </Button>

          {props.productList?.length > 0 ? (
            <>
              <Input
                type="select"
                placeholder="Ordenar por"
                id="product-filter-select"
                options={["Recentes", "Antigos"]}
                setOption={props.setProductsFilter}
                selectedOption={props.productsFilter}
              />

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
                      remove={(id) => {
                        setDeleteId(id);
                        setShowDeleteConfirmation(true);
                      }}
                    >
                      <img src={product.images[0]} alt="" />
                    </ProductCard>
                  ))}
                </div>
              </Box>

              <Pagination
                totalPages={props.paginationInfo.totalPages}
                currentPage={props.currentProductPage}
                setCurrentPage={props.setCurrentProductPage}
              />
            </>
          ) : (
            <div className="empty-product-list-container">
              <Box id="empty-product-box">
                <h1>O estoque de produtos está vazio!</h1>
                <Image name="empty-package.png" />
              </Box>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Produtos;
