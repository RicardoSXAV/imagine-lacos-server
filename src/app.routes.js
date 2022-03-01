const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");

module.exports = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/order", orderRoutes);
};
