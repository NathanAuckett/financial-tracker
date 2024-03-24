import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const routerUsers = require("./routes/users.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2>Server is running!</h2>");
});

app.use("/users", routerUsers);

app.listen(PORT, () => {
  console.log(`API listening on port: ${PORT}`);
});