const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

//INDEX
router.get("/", middleware.user_access, controllers.user_data.getAll);

//SHOW
router.get("/:userid", middleware.user_access, controllers.user_data.getSingle)

//EDIT
router.get("/:userid/:item/edit", middleware.user_access, controllers.user_data.getEdit)

//UPDATE
router.put("/:userid", middleware.user_access, controllers.user_data.updateParent)

router.put("/:userid/:item/multiple", middleware.user_access, controllers.user_data.updateMultipleChildren)

//CREATE
router.post("/:userid/:item", middleware.user_access, controllers.user_data.create)

//NEW
router.get("/:userid/:item/new", middleware.user_access, controllers.user_data.getFormCreate)


/*



//DESTOY
router.delete("/:reportid", middleware.user_access, controllers.reports.deleteReport)
*/

module.exports = router;