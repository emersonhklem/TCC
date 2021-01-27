const Sequelize = require('sequelize')
const connection = require("../database/database")



const Despesa = connection.define('despesas', {
    
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },tipo: {
        type: Sequelize.STRING,
        allowNull: false
    },dia: {
        type: Sequelize.STRING,
        allowNull: false
    },mes: {
        type: Sequelize.STRING,
        allowNull: false
    },valor:{
        type: Sequelize.STRING,
        allowNull: false
    }

    
})

//Despesa.sync({force: true})

//Hora.sync({force: true});

module.exports = Despesa;