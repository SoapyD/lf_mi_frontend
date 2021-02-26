const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin');
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, middleware.isAdmin, adminController.getAllMenus);


module.exports = router;