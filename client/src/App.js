import "./globalStyles.scss";

import { useEffect, useState } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import axios from "axios";

import useLocalStorage from "./hooks/useLocalStorage";
import { useSessionStorage } from "./hooks/useSessionStorage";

// Pages

import Home from "./pages/Home";
import Categoria from "./pages/Categoria";
import Produto from "./pages/Produto";
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
import Pedidos from "./pages/Admin/Pedidos";
import Estatisticas from "./pages/Admin/Estatisticas";

function App() {
  const history = useHistory();

  const [categoryList, setCategoryList] = useSessionStorage([], "categoryList");
  const [productList, setProductList] = useSessionStorage([], "productList");
  const [currentProductPage, setCurrentProductPage] = useSessionStorage(
    1,
    "currentProductPage"
  );
  const [currentCategoryProductPage, setCurrentCategoryProductPage] =
    useState(1);
  const [orderList, setOrderList] = useSessionStorage({}, "orderList");
  const [haveOrderListStatus, setHaveOrderListStatus] = useSessionStorage(
    false,
    "orderListStatus"
  );
  const [paginationInfo, setPaginationInfo] = useSessionStorage(
    {},
    "paginationInfo"
  );
  const [categoryPaginationInfo, setCategoryPaginationInfo] = useState({});
  const [filteredProductList, setFilteredProductList] = useSessionStorage(
    [],
    "filteredProductList"
  );

  const [userData, setUserData] = useSessionStorage({}, "userData");

  const [errorMessage, setErrorMessage] = useState("");
  const [loadUserError, setLoadUserError] = useLocalStorage(
    false,
    "loadUserError"
  );
  const [paginationActive, setPaginationActive] = useState(false);
  const [productsFilter, setProductsFilter] = useSessionStorage(
    "Recentes",
    "productsFilter"
  );
  const [productsFilterActive, setProductsFilterActive] = useState(false);

  // Error Popup

  useEffect(() => {
    if (errorMessage) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [errorMessage]);

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
          .get(`http://localhost:5000/api/product?recent=true`)
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
          .get(
            `http://localhost:5000/api/product?page=${currentProductPage}&recent=true`
          )
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

  useEffect(() => {
    if (productsFilterActive) {
      updateProductList(productsFilter);
    }

    setProductsFilterActive(true);
  }, [productsFilter]);

  async function getCategoryProducts(categoryName) {
    if (filteredProductList.length === 0) {
      await axios
        .get(
          `http://localhost:5000/api/product?category=${categoryName}&page=${currentCategoryProductPage}`
        )
        .then((response) => {
          console.log(response.data);
          setFilteredProductList(response.data.events);
          setCategoryPaginationInfo({
            totalPages: response.data.totalPages,
          });
        })
        .catch((error) => console.log(error.response));
    }
  }

  // User

  async function registerUser(object) {
    await axios
      .post("http://localhost:5000/api/user/register", object)
      .then((response) => console.log(response))
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        console.log(error.response);
      });
  }

  async function loginUser(object) {
    await axios
      .post("http://localhost:5000/api/user/login", object)
      .then((response) => {
        setUserData(response.data);
        setLoadUserError(false);
        history.push("/");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        console.log(error.response);
      });
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

  async function getCategoryProductsCount(id) {
    const response = await axios.get(
      "http://localhost:5000/api/category/count/" + id
    );
    return response.data.countProducts;
  }

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

  async function updateProductList(productsFilter) {
    await axios
      .get(
        `http://localhost:5000/api/product?page=${currentProductPage}${
          productsFilter === "Recentes" && "&recent=true"
        }`
      )
      .then((response) => {
        setProductList(response.data.events);
        setPaginationInfo({
          totalPages: response.data.totalPages,
        });
      })
      .catch((error) => console.log(error.response));
  }

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

  // Order

  useEffect(() => {
    if (JSON.stringify(orderList) !== "{}" && haveOrderListStatus === false) {
      console.log("rodando order");

      const orderListChargeIds = orderList.orders.map(
        (order) => order.paymentInfo.chargeId
      );

      function getOrderListStatus() {
        const promises = [];

        for (let i = 0; i < orderListChargeIds.length; i++) {
          const newRequest = axios.get(
            "http://localhost:5000/api/payment/status/" + orderListChargeIds[i]
          );

          promises.push(newRequest);
        }

        return Promise.all(promises);
      }

      getOrderListStatus()
        .then((responses) => {
          const statusArray = responses.map((response) => response.data.status);

          const newOrderList = {
            orders: orderList.orders.map((order, index) => ({
              ...order,
              paymentStatus: statusArray[index],
            })),
            page: orderList.page,
            totalPages: orderList.totalPages,
          };

          setOrderList(newOrderList);
        })
        .catch((error) => console.log(error.response));

      setHaveOrderListStatus(true);
    }
  }, [orderList]);

  async function getOrders() {
    await axios.get("http://localhost:5000/api/order").then((response) =>
      setOrderList({
        orders: response.data.events,
        page: response.data.page,
        totalPages: response.data.totalPages,
      })
    );
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
              getCategoryProductsCount={getCategoryProductsCount}
              addToCart={addToCart}
              paginationInfo={paginationInfo}
              currentProductPage={currentProductPage}
              setCurrentProductPage={setCurrentProductPage}
              productsFilter={productsFilter}
              setProductsFilter={setProductsFilter}
              updateProductList={updateProductList}
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
              categoryPaginationInfo={categoryPaginationInfo}
              currentCategoryProductPage={currentCategoryProductPage}
              setCurrentCategoryProductPage={setCurrentCategoryProductPage}
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
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              )}
            />
            <Route
              path="/registrar"
              exact
              render={() => (
                <Registrar
                  registerUser={registerUser}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              )}
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
                <Carrinho
                  userData={userData}
                  removeFromCart={removeFromCart}
                  updateUserInformation={updateUserInformation}
                />
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
              render={() => (
                <Administrador userData={userData} logoutUser={logoutUser} />
              )}
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
                  userData={userData}
                  paginationInfo={paginationInfo}
                  currentProductPage={currentProductPage}
                  setCurrentProductPage={setCurrentProductPage}
                  productsFilter={productsFilter}
                  setProductsFilter={setProductsFilter}
                />
              )}
            />

            <Route
              path="/pedidos"
              exact
              render={() => (
                <Pedidos
                  userData={userData}
                  orderList={orderList}
                  getOrders={getOrders}
                />
              )}
            />

            <Route
              path="/estatisticas"
              exact
              render={() => <Estatisticas userData={userData} />}
            />
          </>
        )}

        <Route exact render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
}

export default App;
