const express = require("express")
const Dia = require("./Dia")
const router = express.Router()
const User = require("./Dia")
const adminAuth = require('../middlewares/adminAuth')
const userAuth = require('../middlewares/userAuth')


router.get("/admin/dias/new",adminAuth, (req,res)=>{
  
   
   
    Dia.findAll().then(dias =>{
        res.render("admin/agendamentos/dia/create", { dias: dias})
    })
   
})

router.post("/dias/save",adminAuth, (req,res)=>{
  
    var name = req.body.name;

    Dia.create({
        name: name,
    }).then(()=>{
        res.redirect("/admin/dias/new")
    }).catch((err) =>{
        res.redirect("/")
        console.log(err)
    })
})

module.exports = router;