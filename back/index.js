const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const Blog = require("./blogmodel.js");
const { response } = require("express");

const dbURL = "mongodb://localhost:27017/blog";

mongoose
  .connect(dbURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.post("/", (req, res) => {
  console.log(req.body);
  Blog.create(req.body).then((response) => {
    res.status(200).json(response);
  });
});

app.get("/getMessage", (req, res) =>
  Blog.find().then((response) => res.json(response))
);

app.delete("/delete/:messageId", (req, res) =>
  Blog.deleteOne({ _id: req.params.messageId }).then((response) =>
    res.json(response)
  )
);

app.patch("/update/:messageId", (req, res) => {
  console.log(req);
  Blog.findByIdAndUpdate(
    req.params.messageId,
    { $inc: { likes: 1 } },
    { new: true }
  ).then((response) => {
    res.status(200).json(response);
  });
});

app.listen(5000, () => console.log("Listening on port 5000"));
