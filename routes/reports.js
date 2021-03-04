const express = require("express");
const router = express.Router();
const reportsController = require('../controllers/reports');
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, reportsController.getAllReports);

//CREATE - create new REPORT
router.post("/", middleware.isLoggedIn, reportsController.createReport)

//NEW - show form to create new REPORT
router.get("/new", middleware.isLoggedIn, reportsController.getFormCreateReport)

//SHOW - show REPORT details
router.get("/:reportid", middleware.isLoggedIn, reportsController.getReport)

//EDIT REPORT
router.get("/:reportid/edit", middleware.isLoggedIn, reportsController.getEditReport)

//UPDATE REPORT
router.put("/:reportid", middleware.isLoggedIn, reportsController.updateReport)

//JOIN REPORT
router.put("/:reportid/join", middleware.isLoggedIn, reportsController.updateJoinReport)

//COPY REPORT
router.put("/:reportid/copy", middleware.isLoggedIn, reportsController.updateCopyReport)

//DESTOY
router.delete("/:reportid", middleware.isLoggedIn, reportsController.deleteReport)

module.exports = router;