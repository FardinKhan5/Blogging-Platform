const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')
const cloudinary = require('../utils/cloudinary')
const registerController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) throw new ApiError(400, "All fields are required")
    const isExists = await User.findOne({ $or: [{ username }, { email }] })
    if (isExists) throw new ApiError(400,"User already exists")
    const user = new User({
        username,
        email,
        password
    })
    await user.save()
    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET)
    res.status(201).cookie("token",token,{httpOnly:true,maxAge:24*60*60*1000}).json(new ApiResponse(201,user, "User registered successfully"))
})
const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new ApiError(400, "Email and Password is required")
    const user = await User.findOne({ email })
    if (!user) throw new ApiError(400, "User does not exists")
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new ApiError(400, "Incorrect Password")
    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET)
    res.status(200).cookie("token",token,{httpOnly:true,maxAge:24*60*60*1000}).json(new ApiResponse(200,user, "Logged in successfully"))
})

const logoutController=asyncHandler(async (req,res)=>{
    res.clearCookie("token",{httpOnly:true})
    res.status(200).json(new ApiResponse(200,{},"User logged out successfully"))
})

const getProfileController = asyncHandler(async (req, res) => {
    const userId = req.user.userId
    if (!userId) throw new ApiError(400, "User id is required")
    const profile = await User.findById(userId).select('-bookmarks -__v')
    if (!profile) throw new ApiError(400, "User details not found")
    res.status(200).json(new ApiResponse(200, profile, "Profile details fetched successfully"))
})

const updateProfileController = asyncHandler(async (req, res) => {
    const userId=req.user.userId
    const updateData={
        username:req.body.username,
        email:req.body.email,
        bio:req.body.bio
    }
    if(req.body.password){
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        updateData.password=hashedPassword
    }
    const user = await User.findByIdAndUpdate(userId,updateData, { new: true}).select("-bookmarks -_v")
    if (!user) throw new ApiError(400,"Error occured while updating the profile")
    res.status(200).json(new ApiResponse(200,user,"Profile updated successfully"))
})

const extractPublicId = (link) => {
  const dottedParts = link.split('/').pop().split('.');
  dottedParts.pop();
  return dottedParts.join('.');
};
const updateAvatar=asyncHandler(async (req,res)=>{
    const file=req.file
    const userId=req.user.userId
    if(!userId) throw new ApiError(400,"User id is missing")
    if(!file) throw new ApiError(400,"File is required")
    const user=await User.findById(userId).select("avatar")
    if(user.avatar){
        const avatarId=extractPublicId(user.avatar)
        const deleteResult=await cloudinary.uploader.destroy("bloggingPlatform/avatars/"+avatarId)
        if(deleteResult.result !="ok" && deleteResult.result !== 'not found'){
            throw new ApiError(400,"Previous Avatar deletion failed")
        }
    }
    const base64String = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64String}`;
    const result=await cloudinary.uploader.upload(dataUri,{
        folder:"bloggingPlatform/avatars",
        allowed_formats:["jpg","jpeg","png","webp","bmp"]
    }).catch((error)=>{
        throw new ApiError(400,"Failed to upload file")
    })
    const newAvatar=await User.findByIdAndUpdate(userId,{avatar:result.secure_url},{new:true}).select("avatar")
    res.status(200).json(new ApiResponse(200,{avatar:newAvatar},"Avatar updated successfully"))
})

module.exports = { registerController:registerController, loginController:loginController, getProfileController:getProfileController , updateProfileController:updateProfileController, updateAvatar:updateAvatar,logoutController:logoutController}