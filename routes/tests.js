const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

// router.get("/create", middleware.admin_access, controllers.tests.createTests);

// router.get("/delete", middleware.admin_access, controllers.tests.deleteTests);

// router.get("/", middleware.admin_access, controllers.tests.mergeDocument);

router.get("/", middleware.admin_access, controllers.tests.draw);


module.exports = router;