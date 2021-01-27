const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require('bcryptjs')
const userAuth = require('../middlewares/userAuth')
const Hora = require("../agendamentos/Hora")
const adminAuth = require('../middlewares/adminAuth')


router.get("/admin/users",adminAuth, (req, res) => {
    var success = req.flash("success");
    User.findAll().then(users => {
        res.render("admin/users/index",{ users: users, success});
    });
})


router.get("/admin/users/create", (req,res) =>{
   
   var errorEmail = req.flash("errorEmail");
   var errorName =  req.flash("errorName");
   var errorSurname = req.flash("errorSurname");
   var errorPass = req.flash("errorPass");
   var errorWhats = req.flash("errorWhats");
   var emailIgual = req.flash("emailIgual");
   
  

    res.render("admin/users/create", {errorEmail, errorName, errorSurname, errorPass, errorWhats,emailIgual,})
})

router.post("/users/create", (req,res) =>{
  
    var name = req.body.name;
    var surname = req.body.surname;
    var whatsapp = req.body.whatsapp;
    var email = req.body.email;
    var password = req.body.password;

    var errorEmail;
    var errorName;
    var errorSurname;
    var errorWhats;
    var errorPass;
  var emailIgual = "O email inserido já existe em nosso sistema. Tente se cadastrar com um outro email!";
  var success = "Cadastro realizado com sucesso!"
   

    if(email == undefined || email == ""){
        errorEmail = "Este campo não pode ser vazio!";
    }

    if(name == undefined || name == ""){
        errorName = "Este campo não pode ser vazio!";
    }
    if(surname == undefined || surname == ""){
        errorSurname = "Este campo não pode ser vazio!";
    }
    if(password == undefined || password == ""){
        errorPass =  " Este campo não pode ser vazio!";
       
    }
    if(password != undefined && password != "" && password.length <= 8){
        errorPass =  " A senha precisa ter mais de 8 caracteres!";
    }    

    if(whatsapp == undefined || whatsapp == ""){
        errorWhats = "Este campo não pode ser vazio!";
    }

    if(errorEmail != undefined || errorName != undefined || errorSurname != undefined || errorWhats != undefined || errorPass != undefined){
        req.flash("errorEmail",errorEmail);
        req.flash("errorName",errorName);
        req.flash("errorSurname",errorSurname);
        req.flash("errorPass",errorPass);
        req.flash("errorWhats",errorWhats);
        

        res.redirect("/admin/users/create");
    }else{
      
        
        User.findOne({where:{email:email}}).then( user =>{
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
           
               
            

            if( user == undefined){
                User.create({
                    name: name,
                    surname: surname,
                    whatsapp: whatsapp,
                    email: email,
                    password: hash,
                    permissao: 1
                }).then(()=>{
                    req.flash("success",success);
                    res.redirect("/")
                }).catch((err) =>{
    
                    res.redirect("/admin/users/create" )
                    console.log(err)
                })
    
    
            }else{
                req.flash("emailIgual",emailIgual);
                res.redirect("/admin/users/create")
            }
    
        })
    }


    

})

router.get("/login", (req, res) =>{
   var nologin = req.flash('nologin')
   
    var errorPass = req.flash("errorPass");
    var errorEmail = req.flash("errorEmail");
    var senhaIncorreta = req.flash("senhaIncorreta");
    var emailIncorreto = req.flash("emailIncorreto");
  
    res.render("admin/users/login", {errorPass, errorEmail, senhaIncorreta,nologin,emailIncorreto,})
})

router.post("/authenticate", (req, res) => {
    
    var email = req.body.email;
    var password = req.body.password;
    var errorEmail;
    var errorPass;
    var senhaIncorreta = "Senha incorreta, tente novamente!"
var emailIncorreto = "O email inserido não existe em nosso sistema. Verifique os dados e tente novamente!"
    if(email == undefined || email == ""){
        errorEmail = "Este campo não pode ser vazio!";
    }
    if(password == undefined || password == ""){
        errorPass =  " Este campo não pode ser vazio!";
       
    }
    if(errorEmail != undefined  || errorPass != undefined){
        req.flash("errorEmail",errorEmail);
    
        req.flash("errorPass",errorPass);
    
        res.redirect("/login"); 
    }else{

        User.findOne({where:{email: email}}).then(user => {
      
       
            if(user != undefined){ // Se existe um usuário com esse e-mail
                // Validar senha
                var correct = bcrypt.compareSync(password,user.password);
              
                if(correct){
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        permissao: user.permissao,
                        whatsapp: user.whatsapp
                    }
                    
                    res.redirect("/" );
                }else{
                    req.flash("senhaIncorreta",senhaIncorreta);
                    res.redirect("/login"); 
                }
    
            }else{
                req.flash("emailIncorreto",emailIncorreto);
                res.redirect("/login");
            }
        });
    }
    

});


router.get("/logout",(req,res) =>{
   
    req.session.user = undefined;
    res.redirect("/")
})

router.get("/admin/users/edit/:id", userAuth, (req,res) => {
   
    var success = req.flash("success");

    var id = req.params.id

    if( isNaN(id)) {
        res.redirect("/")
    }
    User.findByPk(id).then(user =>{
        if(user != undefined){
          res.render("admin/users/edit", { user: user, success: success})
        }else{
            res.redirect("/")
        }
    }).catch(erro => {
        res.redirect("/")
        console.log(erro)
    })

})

router.post("/admin/user/update",userAuth, (req, res) =>{
  
    var id = req.body.id
    var name = req.body.name;
    var surname = req.body.surname;
    var whatsapp = req.body.whatsapp;
    var email = req.body.email;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    var success = "Dados alterados com sucesso!"


        User.update({email: email,name: name, surname: surname, whatsapp:whatsapp, password: hash}, {
       
       
            where: {
                id: id
            }
        }).then(()=>{
            req.session.user = undefined;
            req.flash("success",success);
            res.redirect("/")
        })
    

    

})
router.post("/users/delete",adminAuth, (req,res) =>{
    

    var id = req.body.id;

    var success ="Usuário apagado com sucesso!"
    if(id != undefined){
        

        User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            req.flash("success", success)
            res.redirect("/admin/users")
        }).catch(err =>{
            console.log(err)
        })
        if(!isNaN(id)){

        }else{
            res.redirect("/admin/users")
        }
    }else{
        res.redirect("/admin/users")
    }
})
module.exports = router;