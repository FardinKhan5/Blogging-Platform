import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isLoggedIn:false,
    profile:null
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginUser:(state,action)=>{
            state.isLoggedIn=true
            state.profile=action.payload
            localStorage.setItem("isLogin","true")
        },
        logoutUser:(state,action)=>{
            state.isLoggedIn=false
            state.profile=null
            localStorage.removeItem("isLogin")
        },
        updateUser:(state,action)=>{
            state.profile=action.payload
        },
        updateUserPic:(state,action)=>{
            state.profile.avatar=action.payload
        }
    }
})

export const {loginUser,logoutUser,updateUser,updateUserPic}=authSlice.actions

export default authSlice.reducer