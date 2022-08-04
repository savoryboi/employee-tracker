
const { Sequelize } = require('sequelize');

const connection = new Sequelize('emp_db', 'root', '', {
    host: 'localhost', 
    dialect: 'mysql',
    logging: false 
})

connection.sync({force: false})



module.exports = connection;