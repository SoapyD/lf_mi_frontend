const express = require("express");
const router = express.Router({mergeParams: true});
const fusionsController = require('../controllers/fusions');

// router.get("/", fusionsController.getAllFusions);

//CREATE - create new product
router.post("/", fusionsController.createFusion)

// //NEW - show form to create new product
// router.get("/new", fusionsController.getFormCreateReport)

// //SHOW - show product details
// router.get("/:id", fusionsController.getReport)

// //EDIT PRODUCT
// router.get("/:id/edit", fusionsController.getEditReport)

// //UPDATE PRODUCT
// router.put("/:id", fusionsController.updateReport)

// //UPDATE RUN
// router.put("/:id/run", fusionsController.updateRunReport)

// //DESTOY
// router.delete("/:id", fusionsController.deleteReport)

module.exports = router;