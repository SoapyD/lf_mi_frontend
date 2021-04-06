const express = require("express");
const router = express.Router();
const testsController = require('../controllers/tests');
const middleware = require("../middleware");

// router.get("/create", middleware.isLoggedIn, middleware.isAdmin, testsController.createTests);

// router.get("/delete", middleware.isLoggedIn, middleware.isAdmin, testsController.deleteTests);

router.get("/", middleware.isLoggedIn, middleware.isAdmin, testsController.mergeDocument);


module.exports = router;