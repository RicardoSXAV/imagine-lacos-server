require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3000/carrinho"],
  })
);
app.use(cookieParser());

app.use("/api/uploads", express.static("src/uploads"));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(err);
  });

let port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log("Server running on http://localhost:" + port + "/")
);

require("./app.routes")(app);
