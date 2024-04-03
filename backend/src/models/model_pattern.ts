const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const Pattern = sq.define('pattern', {
    pattern_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    regex_string: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    match: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {freezeTableName: true});
