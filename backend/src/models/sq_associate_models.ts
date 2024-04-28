//Import models
const {User} = require('./model_user');
const {Transaction} = require('./model_transaction');
const {BankAccount} = require('./model_bank_account');
const {Category} = require('./model_category');
const {Pattern} = require('./model_pattern');
const {PatternGroup} = require('./model_pattern_group');
const {TransactionCategory} = require('./model_transaction_category');
const {CSVDictionary} = require('./model_csv_dictionary');

// Set associations between models
User.hasMany(Transaction, {foreignKey: "user_id"});
User.hasMany(BankAccount, {foreignKey: "user_id"});
User.hasMany(PatternGroup, {foreignKey: "user_id"});
User.hasMany(Category, {foreignKey: "user_id"});
User.hasMany(CSVDictionary, {foreignKey: "user_id"});

CSVDictionary.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"});

Transaction.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"});
Transaction.belongsTo(BankAccount, {foreignKey: "bank_account_id", onDelete: "CASCADE"});
Transaction.belongsToMany(Category, {
    through: TransactionCategory,
    throughAssociations: {
        fromSource: 'transaction_id',
        toSource: 'transaction_id',
        fromTarget: 'category_id',
        toTarget: 'category_id'
    },
    foreignKey: "transaction_id",
    otherKey: 'category_id',
    onDelete: "CASCADE"
});

BankAccount.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"});
BankAccount.hasMany(Transaction, {foreignKey: "bank_account_id", onDelete: "CASCADE"});

Category.belongsTo(User, {foreignKey: "user_id"});
//Category.hasMany(TransactionCategory, {foreignKey: "category_id"});
Category.belongsToMany(Transaction, {
    through: TransactionCategory,
    throughAssociations: {
        fromSource: 'category_id',
        toSource: 'category_id',
        fromTarget: 'transaction_id',
        toTarget: 'transaction_id'
    },
    foreignKey: "category_id",
    otherKey: 'transaction_id',
    onDelete: "CASCADE"
});
Category.hasMany(PatternGroup, {foreignKey: "category_id", onDelete: "CASCADE"});

Pattern.belongsTo(PatternGroup, {foreignKey: "pattern_group_id", onDelete: "CASCADE"});

PatternGroup.belongsTo(User, {foreignKey: "user_id", onDelete: "CASCADE"});
PatternGroup.hasMany(Pattern, {foreignKey: "pattern_group_id", onDelete: "CASCADE"});
PatternGroup.belongsTo(Category, {foreignKey: "category_id", onDelete: "CASCADE"});


export {};
