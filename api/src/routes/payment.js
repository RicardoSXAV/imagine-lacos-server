const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const validate = require("../middlewares/validate");
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");

const payment = require("../controllers/payment");

router.get("/status/:chargeId", adminAuth, payment.status);

router.get("/:paymentToken", userAuth, payment.creditCard);

router.post("/billet", userAuth, payment.bankingBillet);

router.post("/pix", payment.pix);

module.exports = router;
