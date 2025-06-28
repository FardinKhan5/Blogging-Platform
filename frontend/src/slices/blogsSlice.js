import { createSlice } from "@reduxjs/toolkit"

const initialState={
    blogs:[],
    pages:0,
    page:0,
    total:0,
}

const blogsSlice=createSlice({
    name:"blogs",
    initialState,
    reducers:{
        updateBlogs:(state,action)=>{
            state.blogs=action.payload?.blogs || state.blogs
            state.pages=action.payload?.pages || state.pages
            state.page=action.payload?.page || state.page
            state.total=action.payload?.total || state.total
        }
    }
})

export const {updateBlogs} = blogsSlice.actions

export default blogsSlice.reducer