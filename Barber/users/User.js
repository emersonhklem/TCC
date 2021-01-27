const Sequelize = require('sequelize')
const connection = require("../database/database")



const User = connection.define('users', {
    
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },surname: {
        type: Sequelize.STRING,
        allowNull: false
    },whatsapp:{
        type: Sequelize.STRING,
        allowNull: false
    }
    ,email: {
        type: Sequelize.STRING,
        allowNull: false
    },password: {
        type: Sequelize.STRING,
      allowNull: false
   },permissao: {
    type: Sequelize.INTEGER,
    allowNull: false
   }

    
})



//User.sync({force: true})

module.exports = User;