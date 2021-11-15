const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const validate = require("../middlewares/validate");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");

const order = require("../controllers/order");

router.get("/", adminAuth, order.list);
router.post("/", userAuth, order.create);
router.get("/shipping-price", userAuth, order.shippingPrice);

module.exports = router;
