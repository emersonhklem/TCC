const Sequelize = require('sequelize')
const connection = require("../database/database")



const Dia = connection.define('dias', {
    
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
    
})

//Dia.sync({force: true})

//Dia.sync({force: true})
module.exports = Dia;