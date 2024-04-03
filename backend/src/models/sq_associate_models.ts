//Import models
const {User} = require('./model_user');
const {Transaction} = require('./model_transaction');
const {BankAccount} = require('./model_bank_account');
const {Category} = require('./model_category');
const {Pattern} = require('./model_pattern');

// Set associations between models
User.hasMany(Transaction, {foreignKey: "user_id"});
User.hasMany(BankAccount, {foreignKey: "user_id"});
User.hasMany(Pattern, {foreignKey: "user_id"});

Transaction.belongsTo(User, {foreignKey: "user_id"});
// Transaction.hasOne(Category, {foreignKey: "category_id"});

BankAccount.belongsTo(User, {foreignKey: "user_id"});

Category.hasMany(Transaction, {foreignKey: "category_id"});
Category.hasMany(Pattern, {foreignKey: "category_id"});

Pattern.belongsTo(User, {foreignKey: "user_id"});
//Pattern.hasOne(Category, {foreignKey: "category_id"});

export {};
