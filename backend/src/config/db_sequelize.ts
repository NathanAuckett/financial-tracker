import 'dotenv/config'
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_NAME as string, 'postgres', process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres'
});

async function testConnection(){
    try {
        await sequelize.authenticate();
        console.log("Sequelize connection established successfully");
    }
    catch (error){
        console.log("Sequelize unable to connect to the database: \n", error);
    }
}

module.exports = {
    sq: sequelize,
    testConnection
}