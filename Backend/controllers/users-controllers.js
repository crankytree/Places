const httpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const { json } = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const DUMMY_USERS = [
//   {
//     name: "ankit",
//     email: "ankitjusco@gmail.com",
//     password: "password",
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Cant Fetch Users , try after sometime", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("Validation failed", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong , Try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("Email already exists , Signup failed", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create User , Please Try Again",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed , please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = await jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed , please try again.", 500);
    return next(error);
  }

  res.status(201);
  // res.json({ user: createdUser.toObject({ getters: true }) });
  res.json({userId: createdUser.id , email: createdUser.email , token:token});
};


const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Something went wrong , Try again", 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError(
      "Invalid Credentials , could not log you in",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Cannot log you in please check your credentials and try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid Credentials , could not log you in",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = await jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging up failed , please try again.", 500);
    return next(error);
  }

  // res.status(200).json({
  //   message: "LoggedIn",
  //   user: existingUser.toObject({ getters: true }),
  // });
  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
