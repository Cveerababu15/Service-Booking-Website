const express=require('express');
const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware.js")
const {isAdmin}=require("../middleware/roleMiddleware.js")
const {createService,getAllServices, updateService, disableService}=require("../controllers/serviceController.js")

router.post("/",authMiddleware,isAdmin,createService);
router.get("/",getAllServices)
router.put("/:id",authMiddleware,isAdmin,updateService);
router.patch("/:id/disable",authMiddleware,isAdmin,disableService)

module.exports=router;
