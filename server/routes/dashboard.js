
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/checkAuth");
const dashboardController = require("../controllers/dashboardController");


router.get("/dashboard" ,isLoggedIn, dashboardController.dashboard);
// router.post("/dashboard" , isLoggedIn,dashboardController.dashboardPost);
router.get("/dashboard/add" , isLoggedIn,dashboardController.addPage);
router.post("/add" ,isLoggedIn, dashboardController.add);
router.post("/dashboard/delete/:day/:id" , isLoggedIn,dashboardController.delete);


module.exports = router ;

