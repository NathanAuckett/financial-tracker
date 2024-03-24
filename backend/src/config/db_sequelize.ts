import { Sequelize } from "sequelize";

const sequelize = new Sequelize('financial_tracker', 'postgres', 'admin22501234', {
    host: 'localhost',
    dialect: 'postgres'
});

async function testConnection(){
    try {
        await sequelize.authenticate();
        console.log("Sequelize connection established successfully");
    }
    catch (error){
        console.log("Sequelize unable to connect to the database", error);
    }
}

module.exports = {
    sq: sequelize,
    testConnection
}