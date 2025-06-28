import React, { useEffect, useState } from 'react'
import { getBlogs } from '../api/blogPost'
import { toast } from 'react-toastify'
import Card from '../components/Card'
import Loading from '../components/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlogs } from '../slices/blogsSlice'

function Home() {
    const {blogs,pages,page,total}=useSelector((state)=>state.blogs)
    const dispatch=useDispatch()
    useEffect(() => {
        getBlogs("limit=5")
            .then((data) => { 
                dispatch(updateBlogs(data))
            })
            .catch((error) => toast.error(error.response?.data.message))
    }, [])
    const changePage=async (e)=>{
        const page=e.target.innerText
        try {
            const data=await getBlogs(`page=${page}&limit=5`)
            dispatch(updateBlogs(data))
        } catch (error) {
            toast.error(error.response?.data.message)
        }
    }
    if (blogs.length==0) return <Loading />
    return (
        <>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-5 py-4'>
            {blogs.map((blog) => {
                return <Card key={blog._id} content={blog} />
            })}
        </div>
        <div className="join flex justify-center my-2">
            {Array.from({length:pages}).map((_,index)=>{
                return <button key={index} onClick={changePage} className={`join-item btn btn-lg btn-primary ${page==index+1?"btn-active":""}`}>{index+1}</button>
            })}
        </div>
        </>
    )
}

export default Home