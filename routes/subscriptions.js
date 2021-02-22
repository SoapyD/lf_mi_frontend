const express = require("express");
const router = express.Router({mergeParams: true});
const subscriptionsController = require('../controllers/subscriptions');
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, subscriptionsController.getSubscriptions);

//CREATE - create new product
router.post("/", middleware.isLoggedIn, subscriptionsController.createSubscription)

// //NEW - show form to create new product
router.get("/new", middleware.isLoggedIn, subscriptionsController.getFormCreateSubscription)

// //SHOW - show product details
// router.get("/:id", fusionsController.getReport)

//EDIT REPORT
router.get("/:subscriptionid/edit", middleware.isLoggedIn, subscriptionsController.getEditSubscription)

//UPDATE REPORT
router.put("/:subscriptionid", middleware.isLoggedIn, subscriptionsController.updateSubscription)

//UPDATE REPORTS
router.put("/", middleware.isLoggedIn, subscriptionsController.updateSubscriptions)



module.exports = router;