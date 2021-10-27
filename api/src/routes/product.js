const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const validate = require("../middlewares/validate");
const adminAuth = require("../middlewares/adminAuth");
const multerUpload = require("../middlewares/multerUpload");

const product = require("../controllers/product");

router.get("/", product.list);

router.post(
  "/",
  adminAuth,
  multerUpload.array("images", 5),
  [
    check("category")
      .not()
      .isEmpty()
      .withMessage("O produto deve possuir uma categoria!"),
    check("name")
      .not()
      .isEmpty()
      .withMessage("O produto deve possuir um nome!"),
    check("price")
      .not()
      .isEmpty()
      .withMessage("O produte deve possuir um preço!"),
    check("quantity")
      .not()
      .isEmpty()
      .withMessage("O produto deve possuir uma quantidade!")
      .isInt()
      .withMessage("A quantidade do produto deve ser um número inteiro!"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("O produto deve possuir uma descrição!"),
  ],
  validate,
  product.create
);

router.delete("/:id", adminAuth, product.delete);

module.exports = router;
