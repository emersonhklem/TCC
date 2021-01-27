const Sequelize = require('sequelize')
const connection = require("../database/database")



const Servico = connection.define('servicos', {
    
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },cliente: {
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
    },pagamento:{
        type: Sequelize.STRING,
        allowNull: false
    }

    
})

//Servico.sync({force: true})

//Hora.sync({force: true});

module.exports = Servico;