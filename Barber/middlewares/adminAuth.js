function adminAuth(req, res, next){
   
    if(req.session.user != undefined && req.session.user.permissao == 2){
        
        next();
       
    }else{
        
        
      
        res.redirect("/", );
    }
 }
 
 module.exports = adminAuth