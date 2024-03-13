import  express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h2>Server is running!</h2>");
});

app.listen(PORT, () => {
  console.log(`API listening on port: ${PORT}`);
});