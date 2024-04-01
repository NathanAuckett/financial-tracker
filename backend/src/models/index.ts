//Import models
const {User} = require('./model_user');
const {Transaction} = require('./model_transaction');
const {BankAccount} = require('./model_bank_account');

// // Set associations between models
// User.hasMany(Transaction, {foreignKey: "user_id"});
// User.hasMany(BankAccount, {foreignKey: "user_id"});
// Transaction.belongsTo(User, {foreignKey: "user_id"});
// BankAccount.belongsTo(User, {foreignKey: "user_id"});

module.exports = {
    User,
    Transaction,
    BankAccount
}