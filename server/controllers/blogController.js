const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const cloudinary = require('../utils/cloudinary')
const BlogPost = require("../models/BlogPost")
const createPost = asyncHandler(async (req, res) => {
    const file = req.file
    if (!file) throw new ApiError(400, "CoverImage is required")
    const { title, content, tags } = req.body
    const author = req.user.userId
    if (!title || !content || !tags || !author) throw new ApiError(400, "All fields are required")
    const base64String = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64String}`;
    const result = await cloudinary.uploader.upload(dataUri, {
        folder: "bloggingPlatform/coverImages",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "bmp"]
    }).catch((error) => {
        throw new ApiError(400, "Failed to upload file")
    })
    const post = new BlogPost({
        title,
        content,
        coverImage: result.secure_url,
        tags,
        author
    })
    await post.save()
    res.status(200).json(new ApiResponse(200, post, "Post created successfully"))
})

const getBlogs = asyncHandler(async (req, res) => {
    const { tag, title,content, id,page = 1, limit = 10 } = req.query;

    let query = {};
    // Search by keyword in title or content
    if (title) {
        query={ title: { $regex: title, $options: 'i' } }
    }
    if (content) {
        query={ content: { $regex: content, $options: 'i' } }
    }
    // Filter by tag
    if (tag) {
        query.tags = { $regex: tag, $options: 'i' }
    }

    if (id) {
        const blogs=await BlogPost.find({author:id}).populate('author','username avatar').sort({createdAt:-1})
        return res.status(200).json(new ApiResponse(200,blogs,"Blogs are fetched successfully"))
    }
    const blogs = await BlogPost.find(query)
        .populate('author', 'username avatar') // optional: show author info
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await BlogPost.countDocuments(query);

    res.status(200).json(new ApiResponse(200, {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        blogs
    }, "Blogs are fetched successfully"))
})

const getBlog = asyncHandler(async (req, res) => {
    const blogId = req.params.id
    if (!blogId) throw new ApiError(400, "Blog id is required")
    const blog = await BlogPost.findById(blogId).populate("author","username avatar").populate("comments.user","username avatar")
    if (!blog) throw new ApiError(400, "Cannot fetch the blog details")
    res.status(200).json(new ApiResponse(200, blog, "Blog fetched sucessfully"))
})

const updateBlog = asyncHandler(async (req, res) => {
    const blogId = req.params.id
    if (!blogId) throw new ApiError(400, "Blog id is required")
    const updatedBlog = await BlogPost.findByIdAndUpdate(blogId, req.body, { new: true })
    if (!updateBlog) throw new ApiError(400, "Blog updation failed")
    res.status(200).json(new ApiResponse(200, updatedBlog, "Blog updated successfully"))
})
const extractPublicId = (link) => {
    const dottedParts = link.split('/').pop().split('.');
    dottedParts.pop();
    return dottedParts.join('.');
};
const deleteBlog = asyncHandler(async (req, res) => {
    const blogId = req.params.id
    if (!blogId) throw new ApiError(400, "Blog id is required")
    const deletedBlog = await BlogPost.findByIdAndDelete(blogId)
    if (!deletedBlog) throw new ApiError(400, "Blog deletion failed")
    if (deletedBlog.coverImage) {
        const imageId = extractPublicId(deletedBlog.coverImage)
        await cloudinary.uploader.destroy("bloggingPlatform/coverImages/" + imageId)
    }
    res.status(200).json(new ApiResponse(200, deletedBlog, "Blog deleted successfully"))
})

const updateCover = asyncHandler(async (req, res) => {
    const file = req.file
    if (!file) throw new ApiError(400, "Pls upload cover image")
    const blogId = req.params.id
    if (!blogId) throw new ApiError(400, "Blog id is required")
    const base64String = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64String}`;
    const result = await cloudinary.uploader.upload(dataUri, {
        folder: "bloggingPlatform/coverImages",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "bmp"]
    }).catch((error) => {
        throw new ApiError(400, "Failed to upload file")
    })
    const oldBlog = await BlogPost.findById(blogId)
    const newBlog = await BlogPost.findByIdAndUpdate(blogId, { coverImage: result.secure_url }, { new: true })
    if (!newBlog) throw new ApiError(400, "Cover image updation failed")
    if (oldBlog.coverImage) {
        const imageId = extractPublicId(oldBlog.coverImage)
        await cloudinary.uploader.destroy("bloggingPlatform/coverImages/" + imageId)
    }
    res.status(200).json(new ApiResponse(200,newBlog,"Cover Image updated successfully"))

})

const likePost=asyncHandler(async (req,res)=>{
    const blogId=req.params.id
    if(!blogId) throw new ApiError(400,"Blog id is required")
    const userId=req.user.userId
    const post=await BlogPost.findById(blogId)
    if(!post) throw new ApiError(400,"Cant fetch the post")
    if(post.likes.includes(userId)){
        updatedPost=await BlogPost.findByIdAndUpdate(blogId,{$pull:{likes:userId}},{new:true})
        return res.status(200).json(new ApiResponse(200,updatedPost,"Like removed"))
    }
    post.likes.push(userId)
    post.save()
    res.status(200).json(new ApiResponse(200,post,"Liked"))
})

const commentPost=asyncHandler(async (req,res)=>{
    const blogId=req.params.id
    if(!blogId) throw new ApiErro(400,"Blog id is required")
    const {text} = req.body
    if(!text) throw new ApiError(400,"Comment text is required")
    const userId=req.user.userId
    const post=await BlogPost.findByIdAndUpdate(
        blogId,
        {$push:{comments:{user:userId,text:text}}},{new:true}
    ).select("comments").populate("comments.user","username avatar")
    if(!post) throw new ApiError(400,"Failed to comment")
    res.status(200).json(new ApiResponse(200,post,"Commented Successfully"))
})

const getComments=asyncHandler(async (req,res)=>{
    const blogId=req.params.id
    if(!blogId) throw new ApiErro(400,"Blog id is required")
    const comments=await BlogPost.findById(blogId).select("comments").populate("comments.user","username avatar")
    if(!comments) throw new ApiError(400,"Failed to fetch comments")
    res.status(200).json(new ApiResponse(200,comments,"Comments fetched successfully"))
})

module.exports = { createPost, getBlogs, getBlog, updateBlog, deleteBlog, updateCover, likePost, commentPost, getComments }