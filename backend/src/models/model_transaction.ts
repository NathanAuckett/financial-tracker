const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');


export const Transaction = sq.define('user', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    credit: {
        type: DataTypes.INTEGER,
    },
    debit: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.CHAR,
    },
    type: {
        type: DataTypes.CHAR(100)
    }
}, {freezeTableName: true});


Transaction.sync().then(() => {
    console.log("Transaction model synced!");
});

module.exports = Transaction;