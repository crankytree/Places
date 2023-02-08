const express = require("express");
const path = require('path')
const fs = require('fs');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const httpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images' , express.static(path.join('uploads' , 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin , X-Requested-With , Content-Type , Accept , Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods" , "GET , POST , PATCH , DELETE");
  next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new httpError("Route Not Found", 404);
  throw error;
});

app.use((error, req, res, next) => {

  if(req.file){
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured." });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yi75xd7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(app.listen(process.env.PORT || 5000))
  .catch((err) => {
    console.log(err);
  });
