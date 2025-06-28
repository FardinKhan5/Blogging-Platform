import React, { useEffect, useState } from 'react'
import ListItem from '../components/ListItem'
import Loading from '../components/Loading'
import { deleteBlog, getBlogs } from '../api/blogPost'
import { toast } from 'react-toastify'
import { LuPencilLine, LuX } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Dashboard() {
    const [blogs,setBlogs]=useState([])
    const {profile}=useSelector((state)=>state.auth)
    const navigate=useNavigate()
    useEffect(()=>{
        getBlogs(`id=${profile._id}`)
        .then((data)=>{
            setBlogs(data)
        })
        .catch((error)=>toast.error(error.response?.data.message))
    },[])
    const deletePost=async (id)=>{
        try {
            await deleteBlog(id)
            toast.success("Post deleted successfully")
            setBlogs((prev)=>(prev.filter((post)=>post._id!=id)))
        } catch (error) {
            toast.error(error.response?.data.message)
        }
    }
    if(!profile) <Loading />
  return (
    <div className='md:mx-52'>
        <ul className='list'>
            <li className='flex justify-between items-center my-2'>
                <h1 className="p-4 pb-2 text-xl opacity-60 tracking-wide">Posts:</h1>
                <button onClick={(e)=>navigate("/create-post")} className='btn btn-primary font-bold'>Create Post</button>
            </li>
            {blogs.length==0?<li className="flex flex-col justify-center items-center text-xl opacity-60 tracking-wide">You have not published any post</li>
            :blogs && blogs.map((blog)=>{
                return <ListItem 
                key={blog._id}
                image={blog.coverImage} 
                h1={blog.title}
                h2={new Date(blog.createdAt).toLocaleString("en-in")}
                text={""}
                buttons={true}
                btn1={<LuPencilLine />}
                btn1OnClick={()=>navigate(`/edit-post/${blog._id}`)}
                btn2={<LuX />}
                btn2OnClick={deletePost}
                btn2Params={blog._id}
                classes="bg-secondary border-2 border-base-300" /> 
            })}
        </ul>
    </div>
  )
}

export default Dashboard