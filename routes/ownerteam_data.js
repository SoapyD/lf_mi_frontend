const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

router.get("/", middleware.user_access, controllers.ownerteam_data.getAll);


/*
//CREATE - create new REPORT
router.post("/", middleware.user_access, controllers.reports.createReport)

//NEW - show form to create new REPORT
router.get("/new", middleware.user_access, controllers.reports.getFormCreateReport)

//SHOW - show REPORT details
router.get("/:reportid", middleware.user_access, controllers.reports.getReport)

//EDIT REPORT
router.get("/:reportid/edit", middleware.user_access, controllers.reports.getEditReport)

//UPDATE REPORT
router.put("/:reportid", middleware.user_access, controllers.reports.updateReport)

//JOIN REPORT
router.put("/:reportid/join", middleware.user_access, controllers.reports.updateJoinReport)

//COPY REPORT
router.put("/:reportid/copy", middleware.user_access, controllers.reports.updateCopyReport)

//DESTOY
router.delete("/:reportid", middleware.user_access, controllers.reports.deleteReport)
*/

module.exports = router;