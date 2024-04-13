//Import models
const {User} = require('./model_user');
const {Transaction} = require('./model_transaction');
const {BankAccount} = require('./model_bank_account');
const {Category} = require('./model_category');
const {Pattern} = require('./model_pattern');
const {TransactionCategory} = require('./model_transaction_category');

// Set associations between models
User.hasMany(Transaction, {foreignKey: "user_id"});
User.hasMany(BankAccount, {foreignKey: "user_id"});
User.hasMany(Pattern, {foreignKey: "user_id"});

Transaction.belongsTo(User, {foreignKey: "user_id"});
Transaction.belongsTo(BankAccount, {foreignKey: "bank_account_id"});
Transaction.belongsToMany(Category, {
    through: TransactionCategory,
    throughAssociations: {
        fromSource: 'transaction_id',
        toSource: 'transaction_id',
        fromTarget: 'category_id',
        toTarget: 'category_id'
    },
    foreignKey: "transaction_id",
    otherKey: 'category_id'
});

BankAccount.belongsTo(User, {foreignKey: "user_id"});
BankAccount.hasMany(Transaction, {foreignKey: "bank_account_id"});

Category.hasMany(Pattern, {foreignKey: "category_id"});
Category.hasMany(TransactionCategory, {foreignKey: "category_id"});
Category.belongsToMany(Transaction, {
    through: TransactionCategory,
    throughAssociations: {
        fromSource: 'category_id',
        toSource: 'category_id',
        fromTarget: 'transaction_id',
        toTarget: 'transaction_id'
    },
    foreignKey: "category_id",
    otherKey: 'transaction_id'
});

Pattern.belongsTo(User, {foreignKey: "user_id"});
Pattern.hasOne(Category, {foreignKey: "category_id"});

export {};
