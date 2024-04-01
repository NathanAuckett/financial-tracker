const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const BankAccount = sq.define('bank_account', {
    bank_account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    account_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    }
}, {freezeTableName: true});
