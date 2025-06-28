import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import userPic from '../assets/userPic.png'
import { useSelector } from 'react-redux'
import { LuHeart, LuMessageCircle } from 'react-icons/lu'
import { likePost } from '../api/blogPost'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
function Card({content}) {
    const [blog,setBlog]=useState(content)
    useEffect(()=>{
        setBlog(content)
    },[content])
    const profile=useSelector((state)=>state.auth.profile)
    const toggleLike=async ()=>{
        likePost(blog._id)
        .then((data)=>(setBlog((prev)=>({...prev,likes:data.likes}))))
        .catch((error)=>{toast.error(error.response.data.message)})
    }
    return (
        <div className="card bg-secondary w-72 border-1 shadow-sm">
            <figure className='bg-base-300 h-32'>
                <img
                    src={blog.coverImage}
                    alt="Cover Image" className='object-cover' />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{blog.title}</h2>
                <div className="avatar flex justify-center items-center gap-2">
                    <div className="w-12 rounded-full">
                        <img src={blog.author?.avatar || userPic} alt="avatar"/>
                    </div>
                    <p>By {blog.author?.username}</p>
                </div>
                <div className='space-x-2'>
                     <button onClick={toggleLike} className='btn btn-sm'><LuHeart className={blog.likes.includes(profile?._id)?"fill-red-600":""} /> {blog.likes.length}</button>
                     <button className='btn btn-sm'><LuMessageCircle /> {blog.comments.length}</button>
                </div>
                <div className="card-actions justify-end">
                    <Link to={`/blog/${blog._id}`}><button className="btn btn-primary">Read</button></Link>
                </div>
                <div className="card-actions justify-start">
                    {blog.tags.slice(0,3).map((tag,index)=>{
                        return <div key={index} className="badge badge-outline">{tag}</div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Card