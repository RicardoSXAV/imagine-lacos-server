import "./styles.scss";

import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useSessionStorage } from "../../hooks/useSessionStorage";

import FormWindow from "../../components/Forms/FormWindow";
import Image from "../../components/Image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import BottomBar from "../../components/BottomBar";
import PopupConfirmDelete from "../../components/PopupConfirmDelete";
import Carousel from "../../components/UI/Carousel";
import Input from "../../components/UI/Input";
import Box from "../../components/UI/Box";
import Button from "../../components/UI/Button";

function Home(props) {
  const [showWindow, setShowWindow] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [productsDeleteCount, setProductsDeleteCount] = useState(0);
  const [deleteId, setDeleteId] = useState("");

  // Category
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const history = useHistory();
  const { width } = useWindowDimensions();

  function resetForm() {
    setShowWindow(false);
    setCategoryName("");
    setCategoryImage("");
  }

  function renderNavbar() {
    if (props.userData.role === "admin") {
      return <Navbar admin userData={props.userData} />;
    } else if (props.userData.role === "basic") {
      return <Navbar user userData={props.userData} />;
    } else {
      return <Navbar homePage />;
    }
  }

  function renderBottomBar() {
    if (props.userData.role === "admin") {
      return <BottomBar admin userData={props.userData} />;
    } else if (props.userData.role === "basic") {
      return <BottomBar user userData={props.userData} />;
    } else {
      return <BottomBar homePage />;
    }
  }

  function goToCategoryPage(name) {
    history.push(`/categoria/${name.replace(/\s+/g, "-")}`);
  }

  function confirmDelete() {
    props.deleteCategory(deleteId);
    setShowConfirmDelete(false);
    setDeleteId("");
  }

  function cancelDelete() {
    setShowConfirmDelete(false);
    setDeleteId("");
  }

  useEffect(() => {
    if (showConfirmDelete || showWindow) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [showConfirmDelete, showWindow]);

  return (
    <>
      <FormWindow
        title="Nova categoria"
        showWindow={showWindow}
        setShowWindow={setShowWindow}
        handleSubmit={() => {
          props.createCategory({ categoryName, categoryImage });
          resetForm();
        }}
      >
        <Input
          type="text"
          placeholder="Nome da categoria"
          label="Nome"
          onChange={(event) => setCategoryName(event.target.value)}
        />
        <Input
          type="image"
          label="Imagem"
          onChange={(event) => setCategoryImage(event.target.files[0])}
        />
      </FormWindow>

      {showConfirmDelete && (
        <PopupConfirmDelete confirm={confirmDelete} cancel={cancelDelete}>
          Tem certeza que deseja remover essa categoria
          {productsDeleteCount > 0
            ? ` e ${productsDeleteCount} produto${
                productsDeleteCount > 1 ? "s" : ""
              }?`
            : "?"}
        </PopupConfirmDelete>
      )}

      <div className="home-page">
        {width > 600 ? renderNavbar() : renderBottomBar()}

        <div className="home-container">
          {props.userData.role === "admin" && (
            <Button
              onClick={() => setShowWindow(true)}
              id="add-category-button"
            >
              Adicionar uma categoria
            </Button>
          )}

          {props.userData.role === "admin" ? (
            <Carousel
              clickCard={goToCategoryPage}
              deleteCard={(id) => {
                props.getCategoryProductsCount(id).then((response) => {
                  setProductsDeleteCount(response);
                  setShowConfirmDelete(true);
                  setDeleteId(id);
                });
              }}
              gradient
              deletable
            >
              {props.categoryList &&
                props.categoryList.map((category) => (
                  <Image key={category.id} path={category.image}>
                    {category.name}
                  </Image>
                ))}
            </Carousel>
          ) : (
            <Carousel clickCard={goToCategoryPage} gradient>
              {props.categoryList &&
                props.categoryList.map((category) => (
                  <Image key={category.id} path={category.image}>
                    {category.name}
                  </Image>
                ))}
            </Carousel>
          )}

          {props.productList?.length > 0 ? (
            <div className="product-list-container">
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
                  {props.productList?.map((product) => (
                    <ProductCard
                      key={product._id}
                      title={product.name}
                      category={product.category}
                      categoryId={product.categoryId}
                      price={product.price}
                      id={product._id}
                      addToCart={props.addToCart}
                      haveInCart={props.userData.cartList?.some(
                        (item) => item.productId === product._id
                      )}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => {
                          history.push(`/produto/${product._id}`);
                          window.scrollTo(0, 0);
                        }}
                      />
                    </ProductCard>
                  ))}
                </div>
              </Box>
            </div>
          ) : (
            <div className="empty-product-list-container">
              <Box id="empty-product-box">
                <h1>O estoque de produtos está vazio!</h1>
                <Image name="empty-package.png" />
              </Box>
            </div>
          )}

          {props.productList?.length > 0 && (
            <Pagination
              totalPages={props.paginationInfo.totalPages}
              currentPage={props.currentProductPage}
              setCurrentPage={props.setCurrentProductPage}
            />
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Home;
