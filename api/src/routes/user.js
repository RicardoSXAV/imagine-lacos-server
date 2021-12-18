const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const validate = require("../middlewares/validate");
const userAuth = require("../middlewares/userAuth");
const multerUpload = require("../middlewares/multerUpload");

const user = require("../controllers/user");
const userCart = require("../controllers/userCart");

router.get("/", userAuth, user.getCurrent);

router.get("/list", user.list);

router.patch("/", userAuth, user.updateData);

router.patch(
  "/profile-image",
  userAuth,
  multerUpload.single("profileImage"),
  user.updateProfileImage
);

router.post(
  "/login",
  [
    check("email")
      .not()
      .isEmpty()
      .withMessage("O usuário precisa inserir um endereço de e-mail!")
      .isEmail()
      .withMessage("O endereço de e-mail inserido não é válido!"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("O usuário deve inserir uma senha!"),
  ],
  validate,
  user.login
);

router.post("/login-google", user.loginWithGoogle);

router.get("/logout", user.logout);

router.post(
  "/register",
  [
    check("fullName")
      .not()
      .isEmpty()
      .withMessage("O usuário precisa possuir um nome!"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("O usuário precisa inserir um endereço de e-mail!")
      .isEmail()
      .withMessage("O endereço de e-mail inserido não é válido!"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("O usuário deve inserir uma senha!")
      .isLength({ min: 6 })
      .withMessage("A senha deve possuir pelo menos 6 dígitos!"),
    check("confirmPassword")
      .not()
      .isEmpty()
      .withMessage("O usuário precisa confirmar a senha!"),
  ],
  validate,
  user.register
);

router.delete("/:id", user.delete);

// E-mail verification

router.get("/verify/:token", user.verifyAccount);

// Password reset

router.post(
  "/recover",
  [
    check("email")
      .isEmail()
      .withMessage("Por favor, digite um endereço de e-mail válido."),
  ],
  validate,
  user.recoverPassword
);

router.get("/reset/:token", user.getResetLink);

router.post(
  "/reset/:token",
  [
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("A senha deve possuir pelo menos 6 dígitos!"),
    check("confirmPassword", "As senhas fornecidas não coincidem.").custom(
      (value, { req }) => value === req.body.password
    ),
  ],
  validate,
  user.resetPassword
);

// User cart

router.post("/cart", userAuth, userCart.add);
router.delete("/cart/:removeId", userAuth, userCart.remove);

module.exports = router;
