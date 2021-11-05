const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

//INDEX
router.get("/", middleware.admin_access, controllers.client_data.getAll);

//SHOW
router.get("/:clientid", middleware.admin_access, controllers.client_data.getSingle)

//EDIT REPORT
router.get("/:clientid/:item/edit", middleware.admin_access, controllers.client_data.getEdit)

//UPDATE REPORT
router.put("/:clientid", middleware.admin_access, controllers.client_data.updateParent)

router.put("/:clientid/:item/multiple", middleware.admin_access, controllers.client_data.updateMultipleChildren)



/*
//CREATE - create new REPORT
router.post("/", middleware.user_access, controllers.reports.createReport)

//NEW - show form to create new REPORT
router.get("/new", middleware.user_access, controllers.reports.getFormCreateReport)

//UPDATE REPORT
router.put("/:reportid", middleware.user_access, controllers.reports.updateReport)

//DESTOY
router.delete("/:reportid", middleware.user_access, controllers.reports.deleteReport)
*/

module.exports = router;