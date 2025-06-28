import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { getProfile } from '../api/user'
import { loginUser, logoutUser } from '../slices/authSlice'

function ProtectedRoute({children}) {
        const [loading,setLoading]=useState(true)
        const dispatch = useDispatch()
        const navigate=useNavigate()
        useEffect(() => {
            getProfile()
            .then((data) => {
              dispatch(loginUser(data))
            })
            .catch((error) => {
              dispatch(logoutUser())
              navigate("/login")
            })
            .finally(()=>setLoading(false))
        }, [children])
    if(loading) return <Loading />
    return children
}

export default ProtectedRoute