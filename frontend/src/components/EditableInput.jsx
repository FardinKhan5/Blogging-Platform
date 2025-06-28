import React, { useState } from 'react'
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import { updateProfile } from '../api/user'
function EditableInput({name="name",value="value"}) {
    const [isEditing,setIsEditing]=useState(false)
    const [data,setData]=useState(value)
    const updateField=(e)=>{
        e.preventDefault()
        updateProfile({[name]:data})
        .then((data)=>setIsEditing(false))
        .catch((error)=>console.log(error))
    }
  return (
    <>
    {isEditing?<div className='flex gap-2'>
        <input className='input' type="text" name={name} onChange={(e)=>setData(e.target.value)} value={data}/>
        <button className='btn' onClick={updateField}><LuCheck /></button>
        <button className='btn' onClick={()=>setIsEditing(false)}><LuX /></button>
    </div>:<div className='flex gap-2'>
        <span className='input'>{data}</span>
        <button className='btn' onClick={()=>setIsEditing(true)}><LuPencilLine /></button>
    </div>}
    </>
  )
}

export default EditableInput