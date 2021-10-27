require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const Token = require("../models/Token");

const { sendEmail } = require("../services/sendgrid");

const jwt = require("jsonwebtoken");
const passport = require("passport");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.list = async (req, res) => {};

exports.getCurrent = async (req, res) => {
  try {
    console.log(req.useData);
    const user = await User.findById(req.userData.userId);

    res.status(200).json({
      id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      cartList: user.cartList,
      profileImage: user.profileImage,
      postalInformation: user.postalInformation,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.updateData = async (req, res) => {
  const { fullName, postalInformation } = req.body;
  const { userId } = req.userData;

  if (!fullName && !postalInformation) {
    return res.status(401).json({
      error: true,
      message: "Não foi informado nenhum campo para ser alterado.",
    });
  }

  if (postalInformation) {
    const postalInfoIsCorrect = postalInformationVerify(postalInformation);

    console.log(postalInfoIsCorrect);

    if (postalInfoIsCorrect === false) {
      return res.status(401).json({
        error: true,
        message: "As informações postais estão inválidas.",
      });
    }
  }

  const user = await User.findOne({ _id: userId });

  if (fullName) {
    user.fullName = fullName;
  }

  if (postalInformation) {
    user.postalInformation = postalInformation;
  }

  await user.save();

  res.status(200).json({
    id: user._id,
    name: user.fullName,
    email: user.email,
    role: user.role,
    cartList: user.cartList,
    profileImage: user.profileImage,
    postalInformation: user.postalInformation,
  });
};

exports.updateProfileImage = async (req, res) => {
  const { userId } = req.userData;

  const user = await User.findOne({ _id: userId });

  if (user.googleId) {
    return res.status(401).json({
      error: true,
      message:
        "Não é possível alterar a imagem do perfil para contas do Google.",
    });
  }

  user.profileImage = `http://localhost:5000/api/uploads/${req.file.filename}`;

  await user.save();

  res.status(200).json({
    id: user._id,
    name: user.fullName,
    email: user.email,
    role: user.role,
    cartList: user.cartList,
    profileImage: user.profileImage,
    postalInformation: user.postalInformation,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(401).json({
      error: true,
      message:
        "O endereço de e-mail fornecido não está associado a nenhuma conta. Por favor, verifique o e-mail e tente novamente.",
    });

  if (user.googleId) {
    return res.status(401).json({
      error: true,
      message:
        "Esse e-mail está associado com a autenticação usando o google. Clique em 'Entrar com o Google'.",
    });
  }

  // Validate password
  if (!user.comparePassword(password))
    return res.status(401).json({
      error: true,
      message: "A senha inserida ou o e-mail é inválido.",
    });

  // Make sure the user has been verified
  if (!user.isVerified)
    return res.status(401).json({
      error: true,
      message: "A sua conta ainda não foi verificada!",
    });

  // Login successful, write token, and send back user
  const token = user.generateJWT();
  res.cookie("userToken", token);
  res.status(200).json({
    id: user._id,
    name: user.fullName,
    email: user.email,
    role: user.role,
    cartList: user.cartList,
    profileImage: user.profileImage,
    postalInformation: user.postalInformation,
  });
};

exports.loginWithGoogle = async (req, res) => {
  const { tokenId, profileObj } = req.body;

  await client
    .verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .catch(() =>
      res
        .status(404)
        .json({ error: true, message: "O token fornecido não é válido." })
    );

  const { googleId, imageUrl, email, name } = profileObj;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const newUser = new User({
      googleId,
      fullName: name,
      email,
      profileImage: imageUrl,
      isVerified: true,
      role: "basic",
    });

    await newUser.save();

    const newCart = new Cart({
      userId: newUser._id,
    });

    await newCart.save();

    const token = newUser.generateJWT();
    res.cookie("userToken", token);

    res.status(200).json({
      id: newUser._id,
      name: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      cartList: newUser.cartList,
      profileImage: newUser.profileImage,
      postalInformation: newUser.postalInformation,
    });
  }

  if (existingUser) {
    const token = existingUser.generateJWT();
    res.cookie("userToken", token);

    res.status(200).json({
      id: existingUser._id,
      name: existingUser.fullName,
      email: existingUser.email,
      role: existingUser.role,
      cartList: existingUser.cartList,
      profileImage: existingUser.profileImage,
      postalInformation: existingUser.postalInformation,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("userToken", "");

    res
      .status(200)
      .json({ success: true, message: "O usuário fez logout com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(403)
        .json({ error: true, message: "As senhas não coincidem!" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        error: true,
        message: "Já existe um usuário com esse e-mail!",
      });
    }

    const newUser = new User({ fullName, email, password, role: "basic" });
    await newUser.save();

    await sendVerificationEmail(newUser, req, res);

    return res.status(200).json({
      error: false,
      message: `Um e-mail de verificação foi enviado para ${email}`,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

exports.verifyAccount = async (req, res) => {
  if (!req.params.token) {
    return res
      .status(400)
      .json({ message: "We were unable to find a user for this token." });
  }

  try {
    // Find a matching token
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      res.status(400).json({
        error: true,
        message:
          "Não foi possível encontrar o token fornecido. O seu token deve ter expirado.",
      });
    }

    // If we found a token, find a matching user
    const user = await User.findOne({ _id: token.userId });

    if (!user) {
      res.status(400).json({
        error: true,
        message: "Não foi possível encontrar um usuário para esse token.",
      });
    }

    if (user.isVerified) {
      res
        .status(400)
        .json({ error: true, message: "Esse usuário já foi verificado." });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      error: false,
      message: "A conta foi verificada. Você já pode entrar no site!",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

exports.recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        error: true,
        message: "Não existe nenhuma conta com o endereço de e-mail fornecido.",
      });

    user.generatePasswordReset();

    await user.save();

    // Send email
    let subject = "Imagine Laços | Mudança de senha";
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let link =
      "http://" +
      req.headers.host +
      "/api/user/reset/" +
      user.resetPasswordToken;
    let html = `<p>Hi ${user.username}</p>
                    <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

    await sendEmail({ to, from, subject, html });

    return res
      .status(200)
      .json({ message: "Um e-mail foi enviado para " + user.email + "." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getResetLink = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(401).json({
        message: "O token para resetar a senha expirou ou é inválido.",
      });

    //Redirect user to form with the email address
    return res.render("reset", { user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(401).json({
        message: "O token para resetar a senha expirou ou é inválido.",
      });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isVerified = true;

    await user.save();

    return res
      .status(200)
      .json({ message: "A sua senha foi alterada com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {};

/* Functions */

function postalInformationVerify(object) {
  // Keys verify

  const keysReference1 = [
    "street",
    "number",
    "neighborhood",
    "complement",
    "city",
    "state",
    "zipcode",
    "cpf",
    "birth",
    "phoneNumber",
  ];
  const keysReference2 = [
    "street",
    "number",
    "neighborhood",
    "city",
    "state",
    "zipcode",
    "cpf",
    "birth",
    "phoneNumber",
  ];

  const arrayOfKeys = Object.keys(object);

  const firstComparison = _.isEqual(keysReference1.sort(), arrayOfKeys.sort());
  const secondComparison = _.isEqual(keysReference2.sort(), arrayOfKeys.sort());

  console.log(firstComparison, secondComparison);

  if (!firstComparison && !secondComparison) {
    return false;
  }

  // Values verify

  function checkStringArray(array) {
    return array.every((item) => typeof item === "string");
  }

  const arrayOfValues = Object.values(object);

  const isArrayOfStrings = checkStringArray(arrayOfValues);

  if (!isArrayOfStrings) {
    return false;
  }

  // Zipcode verify

  const zipcodeIsNumber = /^\d+$/.test(object.zipcode);

  if (!zipcodeIsNumber || object.zipcode.length !== 8) {
    return false;
  }

  // State verify

  if (object.state.length > 2) {
    return false;
  }

  // Object passed all tests

  return true;
}

async function sendVerificationEmail(user, req, res) {
  try {
    const token = user.generateVerificationToken();

    // Save the verification token
    await token.save();

    let subject = "Imagine Laços | Verificação da conta";
    let to = user.email;
    let from = process.env.FROM_EMAIL;
    let link = process.env.CLIENT_URL + "/verificacao/" + token.token;

    let html = `<p>Hi ${user.fullName}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                    <br><p>If you did not request this, please ignore this email.</p>`;

    await sendEmail({ to, from, subject, html });

    return res.status(200).json({
      error: false,
      message: `Uma mensagem de verificação foi enviada para o e-mail ${user.email}.`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
