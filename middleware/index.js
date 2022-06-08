
// let middlewareObj = {};



// middlewareObj.isLoggedIn = function(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "You need to be logged in to access content");
//     res.redirect("/")
// }

// middlewareObj.isAdmin = function(req, res, next){
//     if(req.user){
//         if (req.user.role === "App_Admin") {
//             return next();
//         }
//     }
//     req.flash("error", "You are denied access as you do not have an admin role. Please contact your system admin to gain access");
//     res.redirect("/")
// }



// module.exports = middlewareObj


exports.admin_access = [require("./access").isLoggedIn, require("./access").isAdmin]
exports.user_access = [require("./access").isLoggedIn]

// exports.access = []
exports.setup = require("./setup")