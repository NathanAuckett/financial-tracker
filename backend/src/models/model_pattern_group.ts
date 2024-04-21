const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const PatternGroup = sq.define('pattern_group', {
    pattern_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {freezeTableName: true});
