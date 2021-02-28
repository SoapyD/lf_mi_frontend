const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin');
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, middleware.isAdmin, adminController.getAllOptions);

router.get("/:item", middleware.isLoggedIn, middleware.isAdmin, adminController.getItems);

router.get("/:item/new", middleware.isLoggedIn, middleware.isAdmin, adminController.getFormCreateItem);

router.post("/:item", middleware.isLoggedIn, middleware.isAdmin, adminController.createItem);

router.get("/:item/:id/edit", middleware.isLoggedIn, middleware.isAdmin, adminController.getEditItems);

router.put("/:item/:id", middleware.isLoggedIn, middleware.isAdmin, adminController.updateItem)

router.delete("/:item/:id", middleware.isLoggedIn, middleware.isAdmin, adminController.deleteItem)

module.exports = router;