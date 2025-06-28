class ApiError extends Error{
    constructor(status,message="something went wrong",errors=[],stack=""){
        super(message)
        this.status=status
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors
        if(stack){
            this.stack=stack
        }else{
            this.statck=Error.captureStackTrace(this,this.constructor)
        }
    }
}

module.exports=ApiError