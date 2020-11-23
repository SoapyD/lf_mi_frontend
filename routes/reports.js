const express = require("express");
const router = express.Router();
const reportsController = require('../controllers/reports');

router.get("/", reportsController.getAllReports);

//CREATE - create new REPORT
router.post("/", reportsController.createReport)

//NEW - show form to create new REPORT
router.get("/new", reportsController.getFormCreateReport)

//SHOW - show REPORT details
router.get("/:reportid", reportsController.getReport)

//EDIT REPORT
router.get("/:reportid/edit", reportsController.getEditReport)

//UPDATE REPORT
router.put("/:reportid", reportsController.updateReport)

//COPY REPORT
router.put("/:reportid/copy", reportsController.updateCopyReport)

//DESTOY
router.delete("/:reportid", reportsController.deleteReport)

module.exports = router;