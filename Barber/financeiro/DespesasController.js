const express = require("express")

const router = express.Router()
const Servico = require('./Servico')
const Despesa = require('./Despesa')
const adminAuth = require('../middlewares/adminAuth')
const userAuth = require('../middlewares/userAuth')

router.get("/admin/despesas/new",adminAuth, (req, res) =>{
    var errorDescricao = req.flash("errorDescricao");
    var errorTipo =  req.flash("errorTipo");
    var errorDia = req.flash("errorDia");
    var errorMes = req.flash("errorMes");
    var errorValor = req.flash("errorValor");
    var success = req.flash("success");
    
    
    res.render("admin/financeiro/despesas/new",{errorDescricao,errorTipo,errorDia,errorMes,errorValor,success})
})

router.post("/despesas/save",adminAuth, (req,res)=>{
   
    var descricao = req.body.descricao;
    var tipo = req.body.tipo;
    var dia = req.body.dia;
    var mes = req.body.mes;
    var valor = req.body.valor


    var errorDescricao;
    var errorTipo;
    var errorDia;
    var errorMes;
    var errorValor;
 var success = "Dados inseridos com sucesso!"
 
     if(descricao == undefined || descricao == ""){
         errorDescricao = "Este campo não pode ser vazio!";
     }
    
     if(tipo == undefined || tipo == ""){
         errorTipo = "Este campo não pode ser vazio!";
     }
    
     if(dia == undefined || dia == ""){
         errorDia =  " Este campo não pode ser vazio!";
        
     }
     if(mes == undefined || mes == ""){
         errorMes =  " Este campo não pode ser vazio!";
        
     }
    
     if(valor == undefined || valor == ""){
         errorValor =  " Este campo não pode ser vazio!";
        
     }
     
 
     if(errorDescricao != undefined || errorTipo != undefined || errorDia != undefined || errorMes != undefined ||  errorValor != undefined){
         req.flash("errorDescricao",errorDescricao);
         req.flash("errorTipo",errorTipo);
      
         req.flash("errorDia",errorDia);
         req.flash("errorMes",errorMes);
      
         req.flash("errorValor",errorValor);
         
 
         res.redirect("/admin/despesas/new");
     }else{
        Despesa.create({

            descricao: descricao,
           
            dia: dia,
            mes: mes,
            valor: valor,
            tipo: tipo,
        
           
        }).then(()=>{
            req.flash("success", success)
            res.redirect("/usuario/menu")
        }).catch((err) =>{
            res.redirect("/")
            console.log(err)
        })
     }
    
})


router.get("/admin/despesas/relatorio",adminAuth, (req, res) =>{
  
    var x = 1;
    var valordesp = 0;
    var valorserv = 0;
    var form = 0;
    
     res.render("admin/financeiro/despesas/relatorio", { x: x, valordesp:valordesp, valorserv:valorserv,form:form,})
 })
 
 router.post("/admin/relatorio/save",adminAuth, (req,res) =>{
  
    var form = req.body.form;
     var mes = req.body.mes;
     var valordesp = req.body.valordesp
     var valorserv = req.body.valordesp
     var dia = req.body.dia;
     
        if(form == "mes"){
         
            Servico.findAll({where:{mes:mes}}).then(servicos =>{
                 Despesa.findAll({where:{mes:mes}}).then(despesas =>{
                         
                            if(mes == "1"){
                                mes = 'Janeiro'
                            }else if(mes =="2"){
                                mes = 'Fevereiro'
                            }else if(mes == "3"){
                                mes == 'Fevereiro'
                            }
                        res.render("admin/financeiro/despesas/relatorio", { servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp,  mes:mes, form:form})
    
    
                 }).catch(err =>{
                     res.redirect("/usuario/menu" )
                     console.log(err)
                 })
    
    
            }).catch(err =>{
                res.redirect("/usuario/menu", {userName: nome})
                console.log(err)
            })       
            
        }
    
        if(form == "dia"){
            Servico.findAll({where:{dia:dia, mes:mes} }).then(servicos =>{
                 Despesa.findAll({where:{dia:dia, mes:mes }}).then(despesas =>{
                   
                    if(mes == "1"){
                        mes = 'Janeiro'
                    }else if(mes =="2"){
                        mes = 'Fevereiro'
                    }else if(mes == "3"){
                        mes == 'Fevereiro'
                    }
                        res.render("admin/financeiro/despesas/relatorio", { servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp, dia:dia, mes:mes,form:form})
    
                 }).catch(err =>{
                     res.redirect("/usuario/menu")
                     console.log(err)
                 })
    
            }).catch(err =>{
                res.redirect("/usuario/menu")
                console.log(err)
            })       
            
        }
        if(form == "semana"){
            var x = dia;
            parseInt(x);
    
            Servico.findAll({where:{ mes:mes} }).then(servicos =>{
                 Despesa.findAll({where:{ mes:mes }}).then(despesas =>{
                  
    
                    if(mes == "1"){
                        mes = 'Janeiro'
                    }else if(mes =="2"){
                        mes = 'Fevereiro'
                    }else if(mes == "3"){
                        mes == 'Fevereiro'
                    }
                 
                        res.render("admin/financeiro/despesas/relatorio", { servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp, dia:dia, mes:mes,form:form,x:x})
    
    
                 }).catch(err =>{
                     res.redirect("/usuario/menu")
                     console.log(err)
                 })
    
    
            }).catch(err =>{
                res.redirect("/usuario/menu")
                console.log(err)
            })       
            
        }
     
     
 })
module.exports = router;