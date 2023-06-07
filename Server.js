const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

const uri = process.env.MONGOOSE_URI;
mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => console.log("Connected!"));

mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open  ");
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: ");
});

const userSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: String,
    age: Number,
    mobile: Number,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

//! API to check connection

app.get("/", (req, res) => {
  res.json({ Message: "Welcome to our server" });
});

//! API to create a user with id

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

//! Get a user by id

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

//! Get all users

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

//! Update a user by id

app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

//! Delete a user by id

app.delete("/users/:id",async (req, res) => {
  try {
    const id = req.params.id;
    const user =await User.findByIdAndDelete(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
