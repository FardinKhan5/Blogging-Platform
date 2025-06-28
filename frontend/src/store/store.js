import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"
import blogsReducer from "../slices/blogsSlice"
const store=configureStore({
    reducer:{
        auth:authReducer,
        blogs:blogsReducer
    }
})

export default store