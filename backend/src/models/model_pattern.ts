const { sq } = require('../config/db_sequelize');
const { DataTypes } = require('sequelize');

export const Pattern = sq.define('pattern', {
    pattern_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pattern_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    regex_array: {
        type: DataTypes.ARRAY(DataTypes.TEXT), //array of regex strings
        allowNull: false
    },
    match_array: { //match or don't match, parallel to regex_array
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        allowNull: false,
        defaultValue: [true]
    }
}, {freezeTableName: true});
