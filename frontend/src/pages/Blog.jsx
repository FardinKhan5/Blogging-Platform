import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { commentPost, getBlogpost, likePost } from '../api/blogPost'
import { toast } from 'react-toastify'
import ListItem from '../components/ListItem'
import userPic from '../assets/userPic.png'
import { LuHeart, LuMessageCircle, LuSendHorizontal } from 'react-icons/lu'
import { useSelector } from 'react-redux'
import Loading from '../components/Loading'
import 'react-quill-new/dist/quill.snow.css'
import parse from "html-react-parser"
function Blog() {
    const { id } = useParams()
    const profile=useSelector((state)=>state.auth.profile)
    const [blog, setBlog] = useState()
    const commentInputRef=useRef(null)
    const navigate=useNavigate()
    const toggleLike=async ()=>{
        likePost(blog._id)
        .then((data)=>{
            setBlog((prev)=>({...prev,likes:data.likes}))
        })
        .catch((error)=>{
            console.log(error)
            toast.error(error.response?.data.message)
        })
    }
    const handleComment = async (e)=>{
        e.preventDefault()
        const comment=commentInputRef.current.value
        commentPost(blog._id,comment)
        .then((data)=>{setBlog((prev)=>({...prev,comments:data.comments}))})
        .catch((error)=>toast.error(error.response?.data.message))
        .finally(()=>{commentInputRef.current.value=""})
    }
    useEffect(() => {
        if(!id){
            navigate("/")
        }else{
        getBlogpost(id)
            .then((data) => {
                setBlog(data)
            })
            .catch((error) => toast.error(error.response.data.message))
        }
    }, [])

    if (!blog || !profile) return <Loading />
    return (
        <div className='flex flex-col gap-2 p-2 md:mx-32 my-5 bg-base-100 rounded-box shadow-md'>
            <h1 className='text-3xl font-bold'>{blog.title}</h1>
            <div className='flex justify-between items-center'>
                <div className='space-x-2'>
                    <button onClick={toggleLike} className='btn btn-sm'><LuHeart className={blog.likes.includes(profile._id)?"fill-red-600":""} /> {blog.likes.length}</button>
                    <button  className='btn btn-sm'><LuMessageCircle /> {blog.comments.length}</button>
                </div>
            <div className='flex justify-end gap-2'>
                <div><img className="size-8 rounded-box" src={blog.author?.avatar || userPic} /></div>
                <div>
                    <div>{blog.author.username}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">{new Date(blog.createdAt).toLocaleString("en-in")}</div>
                </div>
            </div>
            </div>
            <div className=''>
                <img src={blog.coverImage} className='w-full h-48' alt="Cover Image" />
            </div>
            <div className=''>
                <div className='ql-snow'><div className="ql-editor">{parse(blog.content)}</div></div>
            </div>
            <div>
                <ul className="list">
                    <li className='flex gap-2'>
                        <input ref={commentInputRef} className='input flex-1' name='comment' placeholder='Comment' />
                        <button onClick={handleComment} className='btn btn-primary'><LuSendHorizontal /></button>
                    </li>
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Comments:</li>
                    {blog.comments.reverse().map((comment) => {
                        return <ListItem key={comment._id}
                            image={comment.user?.avatar || userPic}
                            h1={comment.user.username}
                            h2={new Date(comment.timestamp).toLocaleString("en-in")}
                            text={comment.text}
                            buttons={false} />
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Blog