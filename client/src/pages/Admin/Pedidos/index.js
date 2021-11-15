import { useEffect } from "react";

import "./styles.scss";
import Navbar from "../../../components/Navbar";
import Pagination from "../../../components/Pagination";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import OrderView from "../../../components/OrderView";

function Pedidos(props) {
  useEffect(() => {
    if (JSON.stringify(props.orderList) === "{}") {
      props.getOrders();
    }
  }, []);

  return (
    <>
      <Navbar admin userData={props.userData} />
      <div className="order-page-container">
        <Input
          type="select"
          placeholder="Ordenar por"
          id="order-filter-select"
          options={["Recentes", "Antigos"]}
          setOption={props.setProductsFilter}
          selectedOption={props.productsFilter}
        />

        {props.orderList?.orders?.map((order) => (
          <OrderView
            clientName={order.userInfo.name}
            clientEmail={order.userInfo.email}
            clientImage={order.userInfo.profileImage}
            clientNumber={order.userInfo.phoneNumber}
            paymentMethod={order.paymentMethod}
          />
        ))}

        <Pagination
          totalPages={props.orderList.totalPages}
          currentPage={props.orderList.page}
          setCurrentPage={() => console.log("set")}
        />
      </div>
    </>
  );
}

export default Pedidos;
