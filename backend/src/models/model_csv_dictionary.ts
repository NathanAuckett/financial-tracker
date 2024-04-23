const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const CSVDictionary = sq.define('csv_dictionary', {
    csv_dictionary_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bank_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    account_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    credit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    debit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {freezeTableName: true});