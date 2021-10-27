const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const validate = require("../middlewares/validate");
const adminAuth = require("../middlewares/adminAuth");
const multerUpload = require("../middlewares/multerUpload");

const category = require("../controllers/category");

router.get("/", category.list);

router.post(
  "/",
  adminAuth,
  multerUpload.single("image"),
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("A categoria deve possuir um nome!"),
  ],
  validate,
  category.create
);

router.delete("/:id", adminAuth, category.delete);

module.exports = router;
