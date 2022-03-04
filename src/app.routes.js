const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");

module.exports = (app) => {
  app.use("/user", userRoutes);
  app.use("/category", categoryRoutes);
  app.use("/product", productRoutes);
  app.use("/payment", paymentRoutes);
  app.use("/order", orderRoutes);
};
