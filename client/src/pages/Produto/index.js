import "./styles.scss";

import { useHistory } from "react-router-dom";
import priceFormatter from "../../utils/priceFormatter";

import Navbar from "../../components/Navbar";
import ImageViewer from "../../components/ImageViewer";
import Button from "../../components/UI/Button";

function Produto(props) {
  const product = props.productList.find(
    (product) => product._id === props.match.params.id
  );
  const productCategory = props.categoryList.find(
    (category) => category.id === product.categoryId
  );

  const history = useHistory();

  console.log(product, productCategory);

  return (
    <div className="product-page">
      <div className="navbar-product">
        {props.userData.role === "admin" ? (
          <Navbar admin userData={props.userData} />
        ) : props.userData.role === "basic" ? (
          <Navbar user userData={props.userData} />
        ) : (
          <Navbar homePage />
        )}
      </div>

      <div className="category-cover">
        <div className="category-gradient">
          <Button
            buttonType="secondary"
            id="category-back-button"
            onClick={() => history.goBack()}
          >
            Voltar
          </Button>

          <img src={productCategory.image} id="category-cover-image" />
        </div>
      </div>
      <div className="product-title-box">
        <h1>{product.name}</h1>
      </div>
      <div className="navbar-product-space" />

      <div className="product-page-container">
        {product.images?.length > 1 ? (
          <ImageViewer />
        ) : (
          <img src={product.images[0]} />
        )}
        <div className="product-information-box">
          <div className="flex-wrapper">
            <h2>{priceFormatter.format(product.price)}</h2>
            <p>
              {product.quantity > 1
                ? `${product.quantity} produtos disponíveis.`
                : `${product.quantity} produto disponível.`}
            </p>
          </div>
          <div className="flex-wrapper-buttons">
            <Button
              id="product-cart-button"
              buttonType="secondary"
              iconName="full-cart-plus.png"
              onClick={() => props.addToCart(product._id)}
            >
              Adicionar ao carrinho
            </Button>
            <Button id="product-buy-button">Comprar</Button>
          </div>
        </div>

        <div className="product-description-box">
          <h2>Descrição</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Produto;
