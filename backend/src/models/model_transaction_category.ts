const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const TransactionCategory = sq.define('transaction_category', {
    transaction_category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {freezeTableName: true});
