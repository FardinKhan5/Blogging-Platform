import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, updateAvatar } from '../api/user'
import { updateUser, updateUserPic } from '../slices/authSlice'
import EditableInput from '../components/EditableInput'
import {LuPenLine, } from 'react-icons/lu'
import userPic from '../assets/userPic.png'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
function Profile() {
  const { profile } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [uploading,setUploading]=useState(false)
  const updatePic = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      toast.info("No file selected.");
      return;
    }
    const formData = new FormData()
    formData.append("avatar", file)
    setUploading(true)
    updateAvatar(formData)
      .then((data) =>{
        toast.success("Avatar updated successfully")
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setUploading(false)
      })
  }
  useEffect(() => {
    getProfile()
      .then((data) => dispatch(updateUser(data)))
      .catch((err) => console.log(err))
  }, [dispatch,uploading])
  if (!profile) return <Loading />
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="avatar">
        <div className="w-24 rounded-full">
          <img src={profile?.avatar || userPic} />
        </div>
        <label className='label btn btn-sm absolute bottom-1 -right-2'>
          {uploading?<span className="loading loading-sm loading-spinner text-primary"></span>:<LuPenLine />}
          <input ref={fileInputRef} type='file' onChange={updatePic} className='hidden' />
        </label>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <div className='fieldset'>
          <label className='label'>Bio: </label>
          <EditableInput name="bio" value={profile?.bio || ""} />

          <label className='label'>Username: </label>
          <EditableInput name="username" value={profile?.username} />

          <label className='label'>Email: </label>
          <EditableInput name="email" value={profile?.email} />
        </div>
      </div>
    </div>
  )
}

export default Profile