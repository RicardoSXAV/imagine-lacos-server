import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import Routes from "./app.routes";

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
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log("Server running on http://localhost:" + port + "/")
);

Routes(app);
