const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const Category = sq.define('category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {freezeTableName: true});
