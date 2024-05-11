import express from "express";
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


function serverStart(){
  const routerUsers = require("./routes/route_users");
  const routerTransactions = require("./routes/route_transactions");
  const routerBankAccounts = require("./routes/route_bank_accounts");
  const routerCategories = require("./routes/route_categories");
  const routerPatterns = require("./routes/route_patterns");
  const routerPatternGroups = require("./routes/route_pattern_groups");
  const routerCSVFormat = require("./routes/route_csv_format");

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("<h2>Server is running!</h2>");
  });

  app.use("/users", routerUsers);
  app.use("/bank-accounts", routerBankAccounts);
  app.use("/patterns", routerPatterns);
  app.use("/pattern-groups", routerPatternGroups);
  app.use("/categories", routerCategories);
  app.use("/transactions", routerTransactions);
  app.use("/csv-formats", routerCSVFormat);

  app.listen(PORT, () => {
    console.log(`API listening on port: ${PORT}`);
  });
}


// Sync DB then start server - Don't force in prod!
import './models/sq_associate_models';
const { sq, testConnection } = require('./config/db_sequelize');

testConnection();
sq.sync( {force: false} ).then( () => {
  console.log("Sequelize synced!");
  serverStart();
});
