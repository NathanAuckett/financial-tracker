//Import models
const {User} = require('./model_user');
const {Transaction} = require('./model_transaction');

// Set associations
User.hasMany(Transaction, {foreignKey: "user_id"});
Transaction.belongsTo(User, {foreignKey: "user_id"});

module.exports = {
    User,
    Transaction
}