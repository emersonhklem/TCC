const Sequelize = require('sequelize')
const connection = new Sequelize('barberbd', 'root',  '123456', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;