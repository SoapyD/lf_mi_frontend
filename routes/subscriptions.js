const express = require("express");
const router = express.Router({mergeParams: true});
const controllers = require('../controllers');
const middleware = require("../middleware");

router.get("/", middleware.user_access, controllers.subscriptions.getSubscriptions);

//CREATE - create new product
router.post("/", middleware.user_access, controllers.subscriptions.createSubscription)

// //NEW - show form to create new product
router.get("/new", middleware.user_access, controllers.subscriptions.getFormCreateSubscription)


//EDIT REPORT
router.get("/:subscriptionid/edit", middleware.user_access, controllers.subscriptions.getEditSubscription)

//UPDATE REPORT
router.put("/:subscriptionid", middleware.user_access, controllers.subscriptions.updateSubscription)

//UPDATE REPORTS
router.put("/", middleware.user_access, controllers.subscriptions.updateSubscriptions)



module.exports = router;