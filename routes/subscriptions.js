const express = require("express");
const router = express.Router({mergeParams: true});
const subscriptionsController = require('../controllers/subscriptions');

router.get("/", subscriptionsController.getSubscriptions);

//CREATE - create new product
router.post("/", subscriptionsController.createSubscription)

// //NEW - show form to create new product
router.get("/new", subscriptionsController.getFormCreateSubscription)

// //SHOW - show product details
// router.get("/:id", fusionsController.getReport)

//EDIT REPORT
router.get("/:subscriptionid/edit", subscriptionsController.getEditSubscription)

//UPDATE REPORT
router.put("/:subscriptionid", subscriptionsController.updateSubscription)

//UPDATE REPORTS
router.put("/", subscriptionsController.updateSubscriptions)



module.exports = router;