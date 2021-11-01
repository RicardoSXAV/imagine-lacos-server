import "./styles.scss";

import { useState } from "react";
import { useHistory } from "react-router-dom";

import useWindowDimensions from "../../hooks/useWindowDimensions";

import FormWindow from "../../components/Forms/FormWindow";
import Image from "../../components/Image";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import BottomBar from "../../components/BottomBar";
import Carousel from "../../components/UI/Carousel";
import Input from "../../components/UI/Input";
import Box from "../../components/UI/Box";
import Button from "../../components/UI/Button";

function Home(props) {
  const [showWindow, setShowWindow] = useState(false);

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
              deleteCard={props.deleteCategory}
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
                    title={product.name}
                    category={product.category}
                    categoryId={product.categoryId}
                    price={product.price}
                    id={product._id}
                    addToCart={props.addToCart}
                  >
                    <img
                      src={product.images[0]}
                      alt=""
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

          <Pagination
            totalPages={props.paginationInfo.totalPages}
            currentPage={props.currentProductPage}
            setCurrentPage={props.setCurrentProductPage}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
