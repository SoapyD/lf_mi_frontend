const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin');
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, middleware.isAdmin, adminController.getAllOptions);


router.get("/:item", middleware.isLoggedIn, middleware.isAdmin, adminController.getItems);

router.get("/:item/:id/edit", middleware.isLoggedIn, middleware.isAdmin, adminController.getEditItems);


// router.get("/subsections", middleware.isLoggedIn, middleware.isAdmin, adminController.getSubSections);

// router.get("/parameters", middleware.isLoggedIn, middleware.isAdmin, adminController.getParameters);


// router.get("/subsections/:id/edit", middleware.isLoggedIn, middleware.isAdmin, adminController.getEditSubSections);

// router.get("/parameters/:id/edit", middleware.isLoggedIn, middleware.isAdmin, adminController.getEditParameters);




module.exports = router;