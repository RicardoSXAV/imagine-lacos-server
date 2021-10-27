import "./globalStyles.scss";

import { useEffect, useState } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import axios from "axios";

import useLocalStorage from "./hooks/useLocalStorage";
import { useSessionStorage } from "./hooks/useSessionStorage";

// Pages

import Home from "./pages/Home";
import Categoria from "./pages/Categoria";
import Entrar from "./pages/Entrar";
import Registrar from "./pages/Registrar";
import Verificacao from "./pages/Verificacao";

// User Pages

import Usuario from "./pages/Usuario";
import Carrinho from "./pages/Carrinho";
import Pagamento from "./pages/Pagamento";

// Admin Pages

import Administrador from "./pages/Admin/Administrador";
import Produtos from "./pages/Admin/Produtos";
import Produto from "./pages/Produto";

function App() {
  const history = useHistory();

  const [categoryList, setCategoryList] = useSessionStorage([], "categoryList");
  const [productList, setProductList] = useSessionStorage([], "productList");
  const [productsFilter, setProductsFilter] = useState("Recentes");
  const [currentProductPage, setCurrentProductPage] = useSessionStorage(1);
  const [paginationInfo, setPaginationInfo] = useSessionStorage(
    {},
    "paginationInfo"
  );
  const [filteredProductList, setFilteredProductList] = useSessionStorage(
    [],
    "filteredProductList"
  );

  const [userData, setUserData] = useSessionStorage({}, "userData");

  const [loadUserError, setLoadUserError] = useLocalStorage(
    false,
    "loadUserError"
  );
  const [paginationActive, setPaginationActive] = useState(
    false,
    "paginationActive"
  );

  // Get Data

  useEffect(() => {
    if (categoryList.length === 0) {
      async function getCategories() {
        await axios
          .get("http://localhost:5000/api/category")
          .then((response) => setCategoryList(response.data.categoryList));
      }
      getCategories();
    }

    if (productList.length === 0) {
      async function getProducts() {
        await axios
          .get("http://localhost:5000/api/product")
          .then((response) => {
            setProductList(response.data.events);
            setPaginationInfo({
              totalPages: response.data.totalPages,
            });
          })
          .catch((error) => console.log(error.response));
      }
      getProducts();
    }

    if (JSON.stringify(userData) === "{}" && loadUserError === false) {
      async function getUser() {
        await axios
          .get("http://localhost:5000/api/user")
          .then((response) => setUserData(response.data))
          .catch((error) => {
            console.log(error.response);

            setLoadUserError(true);
            setUserData({});
          });
      }
      getUser();
    }
  }, []);

  useEffect(() => {
    if (paginationActive) {
      async function getProducts() {
        await axios
          .get(`http://localhost:5000/api/product?page=${currentProductPage}`)
          .then((response) => {
            setProductList(response.data.events);
            setPaginationInfo({
              totalPages: response.data.totalPages,
            });
          })
          .catch((error) => console.log(error.response));
      }
      getProducts();
    }

    setPaginationActive(true);
  }, [currentProductPage]);

  async function getCategoryProducts(categoryName) {
    if (filteredProductList.length === 0) {
      await axios
        .get(`http://localhost:5000/api/product?category=${categoryName}`)
        .then((response) => setFilteredProductList(response.data.events))
        .catch((error) => console.log(error.response));
    }
  }

  // User

  async function registerUser(object) {
    await axios
      .post("http://localhost:5000/api/user/register", object)
      .then((response) => console.log(response))
      .catch((error) => console.log(error.response));
  }

  async function loginUser(object) {
    await axios
      .post("http://localhost:5000/api/user/login", object)
      .then((response) => {
        setUserData(response.data);
        setLoadUserError(false);
        history.push("/");
      })
      .catch((error) => console.log(error.response));
  }

  async function loginUserWithGoogle(res) {
    const profileObj = res?.profileObj;
    const tokenId = res?.tokenId;

    await axios
      .post("http://localhost:5000/api/user/login-google", {
        tokenId,
        profileObj,
      })
      .then((response) => {
        setUserData(response.data);
        setLoadUserError(false);
        history.push("/");
      })
      .catch((error) => console.log(error.response));
  }

  async function logoutUser() {
    await axios
      .get("http://localhost:5000/api/user/logout")
      .then(() => {
        setUserData({});
        setLoadUserError(false);
        history.push("/");
      })
      .catch((error) => console.log(error.response));
  }

  async function updateUserInformation(object) {
    await axios
      .patch("http://localhost:5000/api/user", object)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => console.log(error.response));
  }

  async function updateUserProfileImage(object) {
    const data = new FormData();
    data.append("profileImage", object.profileImage);

    await axios
      .patch("http://localhost:5000/api/user/profile-image", data)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => console.log(error.response));
  }

  // Category

  async function createCategory(object) {
    const data = new FormData();
    data.append("name", object.categoryName);
    data.append("image", object.categoryImage);

    await axios
      .post("http://localhost:5000/api/category", data)
      .then((response) =>
        setCategoryList([...categoryList, response.data.object])
      )
      .catch((error) => {
        console.log(error.response);
      });
  }

  async function deleteCategory(id) {
    await axios
      .delete("http://localhost:5000/api/category/" + id)
      .then((response) => console.log(response))
      .catch((error) => {
        console.log(error.response);
      });

    const newArray = categoryList.filter((category) => category.id !== id);
    setCategoryList(newArray);
  }

  // Product

  async function createProduct(object) {
    const data = new FormData();
    data.append("category", object.productCategory);
    data.append("name", object.productName);
    data.append("price", object.productPrice);
    data.append("quantity", object.productQuantity);
    data.append("description", object.productDescription);

    Array.from(object.productImages).forEach((file) =>
      data.append("images", file)
    );

    await axios
      .post("http://localhost:5000/api/product", data)
      .then((response) =>
        setProductList([...productList, response.data.object])
      )
      .catch((error) => {
        console.log(error.response);
      });
  }

  async function removeProduct(id) {
    await axios.delete("http://localhost:5000/api/product/" + id);

    const newArray = productList.filter((product) => product.id !== id);
    setProductList(newArray);
  }

  // Cart

  async function addToCart(id) {
    await axios
      .post("http://localhost:5000/api/user/cart", { productId: id })
      .then((response) => setUserData(response.data.updatedUser))
      .catch((error) => console.log(error.response));
  }

  async function removeFromCart(id) {
    await axios
      .delete("http://localhost:5000/api/user/cart/" + id)
      .then((response) => setUserData(response.data.updatedUser))
      .catch((error) => console.log(error.response));
  }

  return (
    <div className="App">
      <Switch>
        <Route
          path="/"
          exact
          render={() => (
            <Home
              userData={userData}
              categoryList={categoryList}
              productList={productList}
              createCategory={createCategory}
              deleteCategory={deleteCategory}
              addToCart={addToCart}
              paginationInfo={paginationInfo}
              currentProductPage={currentProductPage}
              setCurrentProductPage={setCurrentProductPage}
              productsFilter={productsFilter}
              setProductsFilter={setProductsFilter}
            />
          )}
        />

        <Route
          path="/categoria/:id"
          exact
          render={(routeProps) => (
            <Categoria
              {...routeProps}
              categoryList={categoryList}
              filteredProductList={filteredProductList}
              setFilteredProductList={setFilteredProductList}
              getCategoryProducts={getCategoryProducts}
            />
          )}
        />

        <Route
          path="/produto/:id"
          exact
          render={(routeProps) => (
            <Produto
              {...routeProps}
              userData={userData}
              productList={productList}
              categoryList={categoryList}
              addToCart={addToCart}
            />
          )}
        />

        {JSON.stringify(userData) === "{}" && (
          <>
            <Route
              path="/entrar"
              exact
              render={() => (
                <Entrar
                  loginUser={loginUser}
                  loginUserWithGoogle={loginUserWithGoogle}
                />
              )}
            />
            <Route
              path="/registrar"
              exact
              render={() => <Registrar registerUser={registerUser} />}
            />
            <Route
              path="/verificacao/:token"
              exact
              render={(routeProps) => <Verificacao {...routeProps} />}
            />
          </>
        )}

        {/* User */}

        {userData.role === "basic" && (
          <>
            <Route
              path="/usuario"
              exact
              render={() => (
                <Usuario
                  userData={userData}
                  logoutUser={logoutUser}
                  updateUserInformation={updateUserInformation}
                  updateUserProfileImage={updateUserProfileImage}
                />
              )}
            />

            <Route
              path="/carrinho"
              exact
              render={() => (
                <Carrinho userData={userData} removeFromCart={removeFromCart} />
              )}
            />

            <Route path="/pagamento" exact render={() => <Pagamento />} />
          </>
        )}

        {/* Admin */}

        {userData.role === "admin" && (
          <>
            <Route
              path="/administrador"
              exact
              render={() => <Administrador logoutUser={logoutUser} />}
            />

            <Route
              path="/produtos"
              exact
              render={() => (
                <Produtos
                  categoryList={categoryList}
                  productList={productList}
                  createProduct={createProduct}
                  removeProduct={removeProduct}
                />
              )}
            />
          </>
        )}

        <Route exact render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
}

export default App;
