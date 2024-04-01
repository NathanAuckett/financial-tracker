import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

function serverStart(){
  const routerUsers = require("./routes/route_users");
  const routerTransactions = require("./routes/route_transactions");

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("<h2>Server is running!</h2>");
  });

  app.use("/users", routerUsers);
  app.use("/transactions", routerTransactions);

  app.listen(PORT, () => {
    console.log(`API listening on port: ${PORT}`);
  });
}


// Sync DB then start server - Don't force in prod!
import './models';
const { sq, testConnection } = require('./config/db_sequelize');

testConnection();
sq.sync( {force: true} ).then( () => {
  console.log("Sequelize synced!");
  serverStart();
});


