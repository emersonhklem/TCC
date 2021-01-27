const express = require("express")
const router = express.Router()
const Hora = require("./Hora")
const Dia = require("./Dia");
const User = require("../users/User");
const userAuth = require("../middlewares/userAuth")
const adminAuth = require('../middlewares/adminAuth')



router.get("/admin/horas/agender/:mes/:id", (req, res )=> {
  
    var diaId = req.params.id;
   var mes= req.params.mes;

   //janeiro
  if(mes == 1){
    Hora.findAll({where:{diaId: diaId } }).then(horas =>{
        if(horas != undefined){
           
            res.render("admin/agendamentos/hora/agenderjaneiro", {horas: horas, }) 
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
               
            res.render("admin/agendamentos/hora/agenderfevereiro", {horas: horas}) 
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
               
            res.render("admin/agendamentos/hora/agendermarco", {horas: horas}) 
    }
    }).catch(err =>{
        res.redirect("/")
        console.log(err)
    })
  }  
 });


router.post("/agender/save", userAuth, (req,res) =>{
  
    var id = req.body.id;
    var nameAgender = req.session.user.name;
   
    var emailAgender = req.session.user.email;
    var whatsappAgender = req.session.user.whatsapp;
    var agender = req.body.agender;
    var descricaoAgender = req.body.descricaoAgender;
    var name = req.session.user;
 
var nologin = "O agendamento não poderá ser concluído se você não estiver logado!"
var emailDif = "O email digitado não corresponde com algum dos emails cadastrado! Certifique-se de que você digitou o email corretamente!"
var success = "Agendamento realizado com sucesso!"



    if(name != undefined){
       User.findOne({where:{email: emailAgender}}).then(emaill =>{
         
       
            if(emaill == undefined){
                req.flash("emailDif", emailDif)
                res.redirect("/admin/calendar")
                console.log('email diferente')
           
            }else{
                Hora.update({ nameAgender:nameAgender, emailAgender:emailAgender, id: id, agender:agender, whatsappAgender: whatsappAgender,  descricaoAgender: descricaoAgender},{
                    where: {
                        id: id
                    }
                }).then(() =>{
                    req.flash("success", success)
                    res.redirect("/")
                }).catch(err =>{
                    
                    
                    console.log(err)
                })
            }
       })
            
        
        }else{
            
            req.flash("nologin", nologin)
            res.redirect("/login")
            console.log('vc n está logado')
           
        }
 


})

router.get("/admin/horas/new",adminAuth, (req,res)=>{
   
    Dia.findAll().then(dias =>{
        res.render("admin/agendamentos/hora/create", {dias: dias})
    })
})

router.post("/horas/save",adminAuth, (req,res)=>{
  
    var name = req.body.name;
    var agender = req.body.agender;
    var dia = req.body.dia;
    var nameAgender = req.body.nameAgender;
    var emailAgender = req.body.emailAgender;
    var mes = req.body.mes;
    var descricaoAgender =req.body.descricaoAgender;
    var whatsappAgender = req.body.whatsappAgender;

    Hora.create({

        name: name,
        agender: agender,
        diaId : dia,
        nameAgender: nameAgender,
        emailAgender: emailAgender,
        mes: mes,
        descricaoAgender: descricaoAgender,
        whatsappAgender: whatsappAgender,
    }).then(()=>{
        res.redirect("/admin/horas/new")
    }).catch((err) =>{
        res.redirect("/")
        console.log(err)
    })
})
router.get("/agender/apagardados/:id",adminAuth, (req,res) =>{
   
    var id = req.params.id;
     var nameAgender = "x";
     var emailAgender = "x";
     var agender = false;
     var descricaoAgender = "x";
     var whatsappAgender = "x"
 var success = "Dados apagados com sucesso!" 
 
 
 
     
     Hora.update({ nameAgender:nameAgender, emailAgender:emailAgender, id: id, agender:agender, whatsappAgender: whatsappAgender,  descricaoAgender: descricaoAgender},{
         where: {
             id: id
         }
     }).then(() =>{
         req.flash("success", success)
         res.redirect("/usuario/calendar")
     }).catch(err =>{
         res.redirect("/")
         console.log(err)
     })
 
 })

router.get("/agender/edit/:mes/:id", adminAuth,(req,res) =>{
    var id = req.params.id
    var mes = req.params.mes
    var nameMes;
    if( isNaN(id)) {
        res.redirect("/")
    }
    Hora.findAll({where:{id: id}}).then(horas =>{
        if(horas != undefined){
            if(mes == "1"){
                nameMes = 'janeiro'
            }else if(mes =="2"){
                nameMes = 'fevereiro'
            }else if(mes == "3"){
                nameMes == 'março'
            }
            res.render("admin/menu/agendamentos/horas/edit",{horas:horas, id: id, mes: mes,nameMes})
        }else{
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")
        console.log(erro)
    })

   
   
   
   
    
})

 router.post("/agender/edit/save",adminAuth, (req,res) =>{
   
    var id = req.body.id
     var nameAgender = req.body.nameAgender;
     var emailAgender = req.body.emailAgender;
     
     var descricaoAgender = req.body.descricaoAgender;
     var whatsappAgender = req.body.whatsappAgender;
 
 
 var success = "Dados alterados com sucesso!";
 
     
     Hora.update({ nameAgender:nameAgender, emailAgender:emailAgender, id: id, whatsappAgender: whatsappAgender,  descricaoAgender: descricaoAgender},{
         where: {
             id: id
         }
     }).then(() =>{
         req.flash("success", success)
         res.redirect("/usuario/calendar", )
     }).catch(err =>{
         res.redirect("/")
         console.log(err)
     })
 
 })

 router.get("/users/horarios" ,userAuth, (req,res) =>{
    
    var user = req.session.user;
    Hora.findAll({where:{emailAgender: user.email }}).then(horas =>{
        res.render("admin/agendamentos/hora/horarios", {horas})
    })


 })

module.exports = router;