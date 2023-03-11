const express = require("express");

const user = require("../../models/dummyUser");
const jwt = require("jsonwebtoken");

const app = express();
const { name } = user;

app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    jwt.sign({ name }, "privatekey", { expiresIn: "1h" }, (err, token) => {
      if (err) {
        res.json({
          message: "TOKEN COULD NOT BE SENT",
        });
      } else {
        res.json({
          token: token,
        });
      }
    });
  } else {
    res.json({
      message: "INVALID/USERNAME OR PASSWORD",
    });
  }
});

// this is a midddleware
const authorization = (req, res, next) => {
  // first we will get the token from the header

  const header = req.header("authorization");

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    res.json({
      message: "NO TOKEN IS AVAILABLE",
    });
  }
};

// PROTECTED RESOURCE

app.get("/api/porn/resource", authorization, (req, res) => {
  const token = req.token;

  jwt.verify(token, "privatekey", (err, data) => {
    if (err) {
      res.send("YOU DO NOT HAVE A VALID TOKEN TO ACCESS THE PORN");
    } else {
      res.json({
        status: 200,
        porn: data,
      });
    }
  });
});

app.listen(7000, () => {
  console.log("server started");
});

// fetch("/user/data", {
//   method: "GET",
//   headers: {
//     Authorization: "Bearer" + authToken,
//   },
// })
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// IN THE FRONTEDN THIS WOULD BE THE PROCESS
