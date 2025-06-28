import React, { useState } from 'react'
import { toast } from 'react-toastify'
function ListItem({image, h1, h2, text, buttons, btn1="", btn2="", btn1OnClick="", btn1Params="",btn2OnClick="",btn2Params="",classes=""}) {
    const [loading,setLoading]=useState(false)
    const handleBtn1Click=async ()=>{
        setLoading(true)
        await btn1OnClick(btn1Params)
        setLoading(false)
    }
    const handleBtn2Click=async ()=>{
        setLoading(true)
        await btn2OnClick(btn2Params)
        setLoading(false)
    }
    return (
        <li className={`list-row ${classes}`}>
            <div><img className="size-10 rounded-box" src={image} /></div>
            <div>
                <div>{h1}</div>
                <div className="text-xs uppercase font-semibold opacity-60">{h2}</div>
            </div>
            <p className="list-col-wrap text-xs">
                {text}
            </p>
            {buttons &&
                <div className='space-x-2'>
                <button onClick={handleBtn1Click} className="btn btn-square btn-primary">
                    {loading?<span className='loading loading-spinner'></span>:btn1}
                </button>
                
                <button onClick={handleBtn2Click} className="btn btn-square btn-primary">
                    {loading?<span className='loading loading-spinner'></span>:btn2}
                </button>
                </div>
            }
        </li>

    )
}

export default ListItem