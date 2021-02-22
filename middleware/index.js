
let middlewareObj = {};



middlewareObj.isLoggedIn = function(req, res, next){
if(req.isAuthenticated()){
    return next();
}
req.flash("error", "You need to be logged in to access content");
res.redirect("/")
}


module.exports = middlewareObj