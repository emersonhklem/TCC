const Sequelize = require('sequelize')
const connection = require("../database/database")
const Dia = require("../agendamentos/Dia")


const Hora = connection.define('horas', {
    
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },agender: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },nameAgender: {
        type: Sequelize.STRING,
        allowNull: false
    },emailAgender: {
        type: Sequelize.STRING,
        allowNull: false
    },mes: {
        type: Sequelize.STRING,
        allowNull: false
    },descricaoAgender:{
        type: Sequelize.STRING,
        allowNull: false
    },whatsappAgender:{
        type: Sequelize.STRING,
        allowNull: false
    }

    
})
Dia.hasMany(Hora);
Hora.belongsTo(Dia);
//Hora.sync({force: true})

//Hora.sync({force: true});

module.exports = Hora;