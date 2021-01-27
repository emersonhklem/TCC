const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const session = require('express-session')
const connection = require("./database/database")
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const adminAuth = require('./middlewares/adminAuth')
const userAuth = require('./middlewares/userAuth')

const usersController = require("./users/UsersController")
const diasController = require("./agendamentos/DiasController")
const horasController = require("./agendamentos/HorasController")
const menuController = require("./menuuser/MenuController")
const servicosController = require("./financeiro/ServicosController")
const despesasController = require("./financeiro/DespesasController")

const User = require('./users/User')
const Dia = require('./agendamentos/Dia')
const Hora = require('./agendamentos/Hora')
const Servico = require('./financeiro/Servico')
const Despesa = require('./financeiro/Despesa')

//view engine
app.set('view engine', 'ejs');

app.use(cookieParser("senhadocookie"))

app.use(session({
    secret: "barberbarber", cookie: {maxAge: 600000000 }, resave: false, saveUninitialized: true,
}))

app.use(flash());

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
.authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso")
}).catch((error)=>{
    console.log(error)
})


app.use("/", usersController);
app.use("/", diasController);
app.use("/", horasController);
app.use("/", menuController);
app.use("/", servicosController);
app.use("/", despesasController);

//Static
app.use(express.static('public'))

app.get("/", (req, res) =>{   
    var success = req.flash("success");
var nome = req.session.user

res.render("index" ,{userName: nome, success:success, })
 

 
})

//cliente
app.get("/admin/calendar", (req, res) =>{
   
    var emailDif = req.flash('emailDif')
  
    res.render("admin/agendamentos/calendar",{emailDif,})
})
app.get("/admin/janeiro", (req, res) =>{
    res.render("admin/agendamentos/janeiro")
})
app.get("/admin/fevereiro", (req, res) =>{
    res.render("admin/agendamentos/fevereiro")
})
app.get("/admin/marco", (req, res) =>{
    res.render("admin/agendamentos/marco")
})

//usuario
app.get("/usuario/calendar",adminAuth, (req, res) =>{
    var success = req.flash('success')
    res.render("admin/menu/agendamentos/calendar",{success})
})
app.get("/usuario/janeiro",adminAuth, (req, res) =>{
    res.render("admin/menu/agendamentos/janeiro")
})
app.get("/usuario/fevereiro",adminAuth, (req, res) =>{
    res.render("admin/menu/agendamentos/fevereiro")
})
app.get("/usuario/marco",adminAuth, (req, res) =>{
    res.render("admin/menu/agendamentos/marco")
})

app.listen(8080, ()=>{
    console.log("O servidor está rodando...")
})

//Calculos

app.get("/admin/balanco",adminAuth, (req, res) =>{
   var x = 1;
   var valordesp = 0;
   var valorserv = 0;
   var form = 0;
   
    res.render("admin/financeiro/resultado/balanco", {x: x, valordesp:valordesp, valorserv:valorserv,form:form,})
})

app.post("/admin/balanco/save",adminAuth, (req,res) =>{
    var form = req.body.form;
    var mes = req.body.mes;
    var valordesp = req.body.valordesp
    var valorserv = req.body.valordesp
    var dia = req.body.dia;
    

    

        if(form == "mes"){
        
            Servico.findAll({where:{mes:mes}}).then(servicos =>{
                 Despesa.findAll({where:{mes:mes}}).then(despesas =>{
                          valordesp = 0;
                          valorserv = 0;     
                          lucro = 0;
                          resposta = 0;
                          parseFloat(valordesp);
                          parseFloat(valorserv);
                          parseFloat(lucro);
                        
                          
                        
                            despesas.forEach(despesa => {
                                valordesp = valordesp  + parseFloat(despesa.valor);
                            })
                            servicos.forEach(servico => {
                                valorserv = valorserv  + parseFloat(servico.valor);
                            })
                            lucro = (valorserv - valordesp);
                            resposta = lucro.toFixed(2);
                            if(mes == "1"){
                                mes = 'Janeiro'
                            }else if(mes =="2"){
                                mes = 'Fevereiro'
                            }else if(mes == "3"){
                                mes == 'Fevereiro'
                            }
                        res.render("admin/financeiro/resultado/balanco", {servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp, lucro :resposta,  mes:mes, form:form})
    
    
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
                    valordesp = 0;
                    valorserv = 0;     
                    lucro = 0;
                  
                    parseFloat(valordesp);
                    parseFloat(valorserv);
                    parseFloat(lucro);
    
                    despesas.forEach(despesa => {                   
                        valordesp = valordesp  + parseFloat(despesa.valor);                   
                    })
                    servicos.forEach(servico => {                   
                            valorserv = valorserv  + parseFloat(servico.valor);                
                    })
                    lucro = (valorserv - valordesp);
                    resposta = lucro.toFixed(2);
                    if(mes == "1"){
                        mes = 'Janeiro'
                    }else if(mes =="2"){
                        mes = 'Fevereiro'
                    }else if(mes == "3"){
                        mes == 'Fevereiro'
                    }
                        res.render("admin/financeiro/resultado/balanco", {servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp, dia:dia, mes:mes,form:form,lucro:resposta})
    
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
            parseInt(dia);
    
            Servico.findAll({where:{ mes:mes} }).then(servicos =>{
                 Despesa.findAll({where:{ mes:mes }}).then(despesas =>{
                    valordesp = 0;
                    valorserv = 0;     
                    lucro = 0;
                  
                    parseFloat(valordesp);
                    parseFloat(valorserv);
                    parseFloat(lucro);
    
                    despesas.forEach(despesa => {
                       if( despesa.dia == dia || despesa.dia == (dia - 1) || despesa.dia == (dia - 2) || despesa.dia == (dia - 3) || despesa.dia == (dia - 4) || despesa.dia == (dia - 5) || despesa.dia == (dia - 6)){
                        valordesp = valordesp  + parseFloat(despesa.valor);
                       }
                    })
                    servicos.forEach(servico => {
                        if( servico.dia == dia || servico.dia == (dia - 1) || servico.dia == (dia - 2) || servico.dia == (dia - 3) || servico.dia == (dia - 4) || servico.dia == (dia - 5) || servico.dia == (dia - 6)){
                            valorserv = valorserv  + parseFloat(servico.valor);
                            
                        }
                    })
                    lucro = (valorserv - valordesp);
                    resposta = lucro.toFixed(2);
    
                    if(mes == "1"){
                        mes = 'Janeiro'
                    }else if(mes =="2"){
                        mes = 'Fevereiro'
                    }else if(mes == "3"){
                        mes == 'Fevereiro'
                    }
                    toString(dia)
                        res.render("admin/financeiro/resultado/balanco", {servicos: servicos, despesas: despesas, valorserv:valorserv, valordesp:valordesp, dia:dia, mes:mes,form:form, lucro:resposta})
    
    
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



