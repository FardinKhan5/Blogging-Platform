import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { registerUser } from '../api/user'
import { loginUser } from '../slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
const schema = yup.object({
  username: yup.string().min(4, "Username must be atleast 4 characters long").required("Username is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(8, "Password must be atleast 8 characters long").required("Password is required")
})
function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState()
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const onSubmit = (data) => {
    registerUser(data.username, data.email, data.password)
    .then((result) => {
      dispatch(loginUser(result))
      toast.success("Registered successfully")
      navigate("/")
    })
    .catch((error) => setError(error.response.data.message))
  }

  return (
    <div className='flex justify-center items-center h-screen bg-secondary'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-2xl font-bold">Register</legend>

          <label className="label">Username</label>
          <input type="text" className="input" placeholder="Username" {...register("username")} />
          {errors.username?.message && <p className="label text-red-600">{errors.username.message}</p>}
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Email" {...register("email")} />
          {errors.email?.message && <p className="label text-red-600">{errors.email.message}</p>}
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" {...register("password")} />
          {errors.password?.message && <p className="label text-red-600">{errors.password.message}</p>}
          <button className="btn btn-primary mt-4">Register</button>
          <p className="label">Already have an account? <Link to="/login" className='underline'>Login</Link></p>
          {error && <p className="label text-red-600 my-2">{error}</p>}
        </fieldset>
      </form>
    </div>
  )
}

export default Register