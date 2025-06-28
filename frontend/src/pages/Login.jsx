import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../api/user'
import { loginUser } from '../slices/authSlice'
import { toast } from 'react-toastify'
const schema=yup.object({
    email:yup.string().email().required("Email is required"),
    password:yup.string().min(8,"Password must be atleast 8 characters long").required("Password is required")
})
function Login() {
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [error,setError]=useState()
    const {isLoggedIn}=useSelector((state)=>state.auth)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver:yupResolver(schema)
    })
    const onSubmit=async (data)=>{
        try {
            await login(data.email,data.password)
            dispatch(loginUser(data))
            toast.success("logged in successfully")
            navigate('/')
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className='flex justify-center items-center h-screen bg-secondary'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend text-2xl font-bold">Login</legend>

                    <label className="label">Email</label>
                    <input type="email" className="input" placeholder="Email" {...register("email")} />
                    {errors.email?.message && <p className="label text-red-600">{errors.email.message}</p>}
                    <label className="labe">Password</label>
                    <input type="password" className="input" placeholder="Password" {...register("password")} />
                    {errors.password?.message && <p className="label text-red-600">{errors.password.message}</p>}
                    <button className="btn btn-primary mt-4">Login</button>
                    <p className="label">Don't have an account? <Link to="/register" className='underline'>Register</Link></p>
                    {error && <p className="label text-red-600 my-2">{error}</p>}
                </fieldset>
            </form>
        </div>
    )
}

export default Login