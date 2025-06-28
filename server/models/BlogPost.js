const mongoose = require('mongoose')

const BlogPostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        unique:true
    },
    content:{
        type:String,
        required:[true,"Content is required"],
    },
    coverImage:{
        type:String,
        required:[true,"Cover image is required"],
    },
    tags:[
        {
            type:String,
            required:[true,"At least one tag is required"]
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            text:{
                type:String,
                required:[true,'comment text is required']
            },
            timestamp:{
                type:Date,
                default:Date.now
            }
        }
    ]
},{timestamps:true})

const BlogPostModel=mongoose.model("BlogPost",BlogPostSchema)

module.exports=BlogPostModel