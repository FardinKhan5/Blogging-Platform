const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        unique:true,
        minLength:[8,'Password must be at least 8 characters long.']
    },
    bio:{
        type:String
    },
    avatar:{
        type:String
    },
    bookmarks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'BlogPost'
        }
    ]
},{timestamps:true})

UserSchema.pre("save",function (next){
    if(!this.isModified("password")) return
    this.password=bcrypt.hashSync(this.password,10)
    next()
})

const UserModel=mongoose.model("User",UserSchema)

module.exports=UserModel