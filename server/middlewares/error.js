const ApiError = require('../utils/ApiError')

const returnError=(err,req,res,next)=>{
    const status=err.status || 500
    const error={}
    if(err instanceof ApiError){
        error.status=status,
        error.data=err.data
        error.message=err.message
        error.success=err.success
        error.errors=err.errors
        error.stack=err.stack
    }
    res.status(status).json({
        status:status,
        data:error.data,
        message:error.message || err.message || "Internal server error",
        success:error.success || false,
        errors:error.errors || [],
        stack:error.stack
    })
}

module.exports=returnError