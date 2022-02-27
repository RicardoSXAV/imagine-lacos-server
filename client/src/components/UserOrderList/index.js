import "./style.scss";

import { useEffect, useState } from "react";
import axios from "axios";

import Icon from "../Icon";
import UserOrderCard from "../UserOrderCard";
import { useSessionStorage } from "../../hooks/useSessionStorage";

function UserOrderList(props) {
  const [userOrders, setUserOrders] = useSessionStorage({}, "userOrders");

  async function getUserOrders() {
    if (JSON.stringify(userOrders) === "{}") {
      await axios
        .get("http://localhost:5000/api/order/user")
        .then((response) => {
          const data = response.data.orders;

          const notCompleted = data.filter((item) => item.completed !== true);
          const completed = data.filter((item) => item.completed !== false);

          setUserOrders({ notCompleted, completed });
          console.log(userOrders);
        })
        .catch((error) => console.log(error.response));
    }
  }

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div
      className="user-order-list"
      style={
        props.showUserOrderList ? { display: "block" } : { display: "none" }
      }
    >
      <div className="user-order-list-box">
        <Icon
          id="user-order-list-close"
          name="x-button.png"
          onClick={() => props.setShowUserOrderList(false)}
        />

        <h1>Pedidos</h1>

        <div className="in-progress-tag">
          <h2>Em andamento</h2>
        </div>
        {userOrders?.notCompleted?.map((order) => (
          <UserOrderCard orderDetails={order.postalInformation} />
        ))}
        <div className="completed-tag">
          <h2>Concluído</h2>
        </div>
      </div>
      {userOrders?.completed?.map((order) => (
        <UserOrderCard />
      ))}
      <div className="background-blur" />
    </div>
  );
}

export default UserOrderList;
