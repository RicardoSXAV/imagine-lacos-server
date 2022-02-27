const express = require("express");
const router = express.Router();

const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");

const order = require("../controllers/order");

router.get("/", adminAuth, order.list);
router.get("/user", userAuth, order.getUserOrders);
router.get("/invert-completed/:orderId", adminAuth, order.invertCompleted);
router.post("/", userAuth, order.create);
router.get("/shipping-price", userAuth, order.shippingPrice);

module.exports = router;
