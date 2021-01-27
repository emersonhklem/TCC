const express = require("express")
const Servico = require('./Servico')
const router = express.Router()
const Despesa = require('./Despesa')
const Hora = require("../agendamentos/Hora")
const adminAuth = require('../middlewares/adminAuth')
const userAuth = require('../middlewares/userAuth')


router.get("/admin/servicos/new",adminAuth, (req, res) =>{
    var errorDescricao = req.flash("errorDescricao");
    var errorTipo =  req.flash("errorTipo");
    var errorDia = req.flash("errorDia");
    var errorMes = req.flash("errorMes");
    var errorCliente = req.flash("errorCliente");
    var errorPagamento = req.flash("errorPagamento");
    var errorValor = req.flash("errorValor");
    var success = req.flash("success");
    
    
    res.render("admin/financeiro/servicos/new",{errorDescricao,errorTipo,errorDia,errorMes,errorCliente,errorPagamento,errorValor,success})
})

router.post("/servicos/save",adminAuth, (req,res)=>{
   
    var descricao = req.body.descricao;
    var tipo = req.body.tipo;
    var cliente = req.body.cliente;
    var dia = req.body.dia;
    var mes = req.body.mes;
    var pagamento = req.body.pagamento
    var valor = req.body.valor

   var errorDescricao;
   var errorTipo;
   var errorCliente;
   var errorDia;
   var errorMes;
   var errorPagamento;
   var errorValor;
var success = "Dados inseridos com sucesso!"

    if(descricao == undefined || descricao == ""){
        errorDescricao = "Este campo não pode ser vazio!";
    }
   
    if(tipo == undefined || tipo == ""){
        errorTipo = "Este campo não pode ser vazio!";
    }
    if(cliente == undefined || cliente == ""){
        errorCliente = "Este campo não pode ser vazio!";
    }
    if(dia == undefined || dia == ""){
        errorDia =  " Este campo não pode ser vazio!";
       
    }
    if(mes == undefined || mes == ""){
        errorMes =  " Este campo não pode ser vazio!";
       
    }
    if(pagamento == undefined || pagamento == ""){
        errorPagamento =  " Este campo não pode ser vazio!";
       
    }
    if(valor == undefined || valor == ""){
        errorValor =  " Este campo não pode ser vazio!";
       
    }
    

    if(errorDescricao != undefined || errorTipo != undefined || errorDia != undefined || errorMes != undefined || errorPagamento != undefined || errorCliente != undefined || errorValor != undefined){
        req.flash("errorDescricao",errorDescricao);
        req.flash("errorTipo",errorTipo);
        req.flash("errorCliente",errorCliente);
        req.flash("errorDia",errorDia);
        req.flash("errorMes",errorMes);
        req.flash("errorPagamento",errorPagamento);
        req.flash("errorValor",errorValor);
        

        res.redirect("/admin/servicos/new");
    }else{

        Servico.create({

            descricao: descricao,
            cliente: cliente,
            dia: dia,
            mes: mes,
            valor: valor,
            tipo: tipo,
            pagamento: pagamento,
           
        }).then(()=>{
            req.flash("success", success)
            res.redirect("/usuario/menu")
        }).catch((err) =>{
            res.redirect("/")
            console.log(err)
        })
    }
   
})


router.get("/admin/servicos/relatorio",adminAuth, (req, res) =>{
    
   
    var x = 1;
    var valordesp = 0;
    var valorserv = 0;
    var form = 0;

    var success = req.flash("success");
     res.render("admin/financeiro/servicos/relatorio", { x: x, valordesp:valordesp, valorserv:valorserv,form:form,success})
 })
 
 router.post("/admin/relatorio/servicos/save",adminAuth, (req,res) =>{
   
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
                                mes == 'Março'
                            }
                        res.render("admin/financeiro/servicos/relatorio", { servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp,  mes:mes, form:form,})
    
    
                 }).catch(err =>{
                     res.redirect("/usuario/menu")
                     console.log(err)
                 })
    
    
            }).catch(err =>{
                res.redirect("/usuario/menu")
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
                        mes == 'Março'
                    }
                        res.render("admin/financeiro/servicos/relatorio", { servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp, dia:dia, mes:mes,form:form,})
    
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
                        mes == 'Março'
                    }
                 
                        res.render("admin/financeiro/servicos/relatorio", { servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp, dia:dia, mes:mes,form:form,x:x,})
    
    
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


 router.get("/admin/servicos/newok/:id",adminAuth, (req,res) =>{
    var errorDescricao = req.flash("errorDescricao");
    var errorTipo =  req.flash("errorTipo");
    var errorDia = req.flash("errorDia");
    var errorMes = req.flash("errorMes");
    var errorCliente = req.flash("errorCliente");
    var errorPagamento = req.flash("errorPagamento");
    var errorValor = req.flash("errorValor");
    var success = req.flash("success");
  
    var id = req.params.id;
    Hora.findAll({where:{id: id}}).then(horas =>{
        res.render("admin/financeiro/servicos/newok", {horas: horas,errorDescricao,errorTipo,errorDia,errorMes,errorCliente,errorPagamento,errorValor,success})
    })
    
   
 })


 router.get("/admin/servicos/editpag/:id",adminAuth, (req,res) =>{

   var id = req.params.id;
   var pag = "Ok";

    Servico.update({pagamento: pag },{
        where:{
            id: id
        }
    }).then(() =>{
      res.redirect("/admin/servicos/relatorio")
    }).catch(erro =>{
     console.log(err)
    })

    
 })


module.exports = router;