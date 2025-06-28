const jwt=require("jsonwebtoken")
const ApiError=require('../utils/ApiError')
function verifyAuthToken(req,res,next){
    try {
    if(!req.headers.authorization && !req.cookies.token) throw new ApiError(403,"Access-Denied")
    const token=req.cookies?.token || req.headers?.authorization.split(" ")[1]
    if(!token) throw new ApiError(403,"Invalid token")
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    } catch (error) {
        throw new ApiError(403,error.message)
    }
}

module.exports= verifyAuthToken