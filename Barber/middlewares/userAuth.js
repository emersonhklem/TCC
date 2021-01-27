function userAuth(req, res, next){
   
    if(req.session.user != undefined){
        if(req.session.user.permissao == 1 || req.session.user.permissao == 2){
        next();
        }
    }else{
        
        
      
        res.redirect("/login", );
    }
 }
 
 module.exports = userAuth