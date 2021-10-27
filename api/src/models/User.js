require("dotenv").config();

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Token = require("./Token");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: "First Name is required",
      max: 100,
    },

    email: {
      type: String,
      unique: true,
      required: "O endereço de e-mail é necessário.",
      trim: true,
    },

    googleId: {
      type: String,
      unique: true,
      required: false,
    },

    password: {
      type: String,
      required: false,
      max: 100,
    },

    role: {
      type: String,
      default: "basic",
    },

    profileImage: {
      type: String,
      required: false,
    },

    postalInformation: {
      type: Object,
      default: {},

      street: { type: String },
      number: { type: String },
      neighborhood: { type: String },
      complement: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String },
      cpf: { type: String },
      birth: { type: String },
      phoneNumber: { type: String },
    },

    cartList: {
      type: Array,
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  let payload = {
    id: this._id,
    email: this.email,
    fullName: this.fullName,
    role: this.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in one hour
};

UserSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString("hex"),
  };

  return new Token(payload);
};

module.exports = mongoose.model("User", UserSchema);
