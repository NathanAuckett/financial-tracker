const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const Category = sq.define('category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {freezeTableName: true});
