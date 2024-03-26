const { sq } = require('../config/db_sequelize');

const User = require('./model_user');
const Transaction = require('./model_transaction');

User.hasMany(Transaction);
Transaction.belongsTo(User);

sq.sync({force: true}).then(() => {
    console.log("Sequelize Synced!");
});