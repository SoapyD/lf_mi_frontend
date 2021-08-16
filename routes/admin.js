const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const middleware = require("../middleware");

router.get("/", middleware.admin_access, controllers.admin.getAllOptions);

router.get("/subscriptionjobs", middleware.admin_access, controllers.admin.getSubscriptionJobs);

router.get("/:item", middleware.admin_access, controllers.admin.getItems);

router.get("/:item/new", middleware.admin_access, controllers.admin.getFormCreateItem);

router.post("/:item", middleware.admin_access, controllers.admin.createItem);

router.get("/:item/:id/edit", middleware.admin_access, controllers.admin.getEditItems);

router.put("/:item/:id", middleware.admin_access, controllers.admin.updateItem)

router.delete("/:item/:id", middleware.admin_access, controllers.admin.deleteItem)

module.exports = router;