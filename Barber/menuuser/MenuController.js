const express = require("express")
const router = express.Router()
const Hora = require("../agendamentos/Hora")
const Dia = require("../agendamentos/Dia")
const User = require("../users/User")
const adminAuth = require('../middlewares/adminAuth')
const userAuth = require('../middlewares/userAuth')



router.get("/usuario/menu",adminAuth, (req,res) =>{
    var success = req.flash("success");
    var nome = req.session.user
    res.render("admin/menu/menuuser",{success,userName:nome})
})

router.get("/usuario/horas/agender/:mes/:id",adminAuth, (req, res )=> {
  
    var diaId = req.params.id;
    var mes= req.params.mes;
    
    //janeiro
   if(mes == 1){
    
    
    
    Hora.findAll({where:{diaId: diaId } }).then(horas =>{
       
       
            
        
        if(horas != undefined){
                
             res.render("admin/menu/agendamentos/horas/agenderjaneiro", { horas: horas,  }) 
     }
    
     }).catch(err =>{
         res.redirect("/")
         console.log(err)
     })
   }  
 //fevereiro
 if(mes == 2){
     Hora.findAll({where:{diaId: diaId } }).then(horas =>{
         if(horas != undefined){
                
             res.render("admin/menu/agendamentos/horas/agenderfevereiro", { horas: horas }) 
     }
     }).catch(err =>{
         res.redirect("/")
         console.log(err)
     })
   }  
   //março
   if(mes == 3){
     Hora.findAll({where:{diaId: diaId } }).then(horas =>{
         if(horas != undefined){
                
             res.render("admin/menu/agendamentos/horas/agendermarco", { horas: horas }) 
     }
     }).catch(err =>{
         res.redirect("/")
         console.log(err)
     })
   }  
  });
 
module.exports = router;