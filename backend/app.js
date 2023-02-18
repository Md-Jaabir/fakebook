const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors");
const app = express();
const accountRouter = require("./routes/account.js");
const postRouter = require("./routes/post.js");
require("dotenv").config();
mongoose.set('strictQuery', false);

app.use(cors({origin:"*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to fakebook backend" });
});

app.use("/account", accountRouter);
app.use("/post", postRouter);
app.listen(process.env.PORT, () => {
  console.log("server is listening");
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("successfully connected to the database");
  }).catch((e) => {
    console.log(e);
  })
})