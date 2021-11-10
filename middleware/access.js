


exports.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to access content");
    res.redirect("/")
}

exports.isAdmin = function(req, res, next){
    if(req.user){
        if (req.user.role === "App_Admin") {
            return next();
        }
    }
    req.flash("error", "You are denied access as you do not have an admin role. Please contact your system admin to gain access");
    res.redirect("/")
}

/*
exports.isClientDataAdmin = function(req, res, next){
    if(req.user){
        if (req.user.role === "App_Admin" || req.user.role === "ClientData_Admin") {
            return next();
        }
    }
    req.flash("error", "You are denied access as you do not have an admin role. Please contact your system admin to gain access");
    res.redirect("/")
}

exports.isUserDataAdmin = function(req, res, next){
    if(req.user){
        if (req.user.role === "App_Admin" || req.user.role === "UserData_Admin") {
            return next();
        }
    }
    req.flash("error", "You are denied access as you do not have an admin role. Please contact your system admin to gain access");
    res.redirect("/")
}
*/