import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ThemeController from './ThemeController'
import { logout } from '../api/user'
import { logoutUser } from '../slices/authSlice'
import userPic from "../assets/userPic.png"
import { toast } from 'react-toastify'
import { useState } from 'react'
import { getBlogs } from '../api/blogPost'
import { updateBlogs } from '../slices/blogsSlice'
import { useRef } from 'react'

function Navbar() {
    const {profile}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    const searchRef=useRef(null)
    const filterRef=useRef(null)
    const navigate=useNavigate()
    const handleLogout=()=>{
      logout()
      .then((data)=>{
        toast.success("Logged out successfully")
        navigate("/login")
        dispatch(logoutUser())
      })
      .catch((error)=>toast.error("Logout Failed"))
    }
    const handleSearch=async ()=>{
      try {
        let search=searchRef.current.value
        let filter=filterRef.current.value
        const data=await getBlogs(`${filter}=${search}`)
        dispatch(updateBlogs(data))
      } catch (error) {
        toast.error(error.response?.data.message)
      }
    }
  return (
    <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <Link to="/" className="btn btn-ghost text-xs md:text-xl">Blogging Platform</Link>
  </div>
  <div className="flex gap-2">
    <label className="input ps-0">
    <select ref={filterRef} defaultValue="title" className="select w-18 border-0 ring-0 focus:outline-none h-full select-xs md:select-md" onChange={handleSearch}>
  <option className='text-left p-0'>title</option>
  <option className='text-left p-0'>tag</option>
</select>
    <input type="text" ref={searchRef} placeholder="Search" className="grow w-24 md:w-auto" onChange={handleSearch} />
</label>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Profile image"
            src={profile?.avatar  || userPic } />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow gap-2">
        <li>
          <Link to="/profile" className="justify-between">
            Profile
          </Link>
        </li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><button className='btn btn-primary' onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  </div>
  <div className="ms-2"><ThemeController /></div>
</div>
  )
}

export default Navbar