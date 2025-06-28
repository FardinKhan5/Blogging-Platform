const express=require('express')
const {registerController,loginController,getProfileController,updateProfileController, updateAvatar, logoutController} = require('../controllers/authController')
const verifyAuthToken = require('../middlewares/auth')
const upload=require('../middlewares/multerUpload')
const router=express.Router()

router.post("/register",registerController)
router.post("/login",loginController)
router.get("/logout",logoutController)
router.get("/profile/",verifyAuthToken,getProfileController)
router.patch("/profile/",verifyAuthToken,updateProfileController)
router.patch("/profile/avatar/",verifyAuthToken,upload.single("avatar"),updateAvatar)
module.exports=router