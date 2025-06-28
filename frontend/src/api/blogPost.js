import api from "./axios"

const getBlogs = async (query) => {
    try {
        const res = await api.get(`/blogs/?${query}`)
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const publish = async (formData) => {
    try {
        const res = await api.post("/blogs/", formData,{
            headers:{"Content-Type":"multipart/form-data"}
        })
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const getBlogpost = async (id) => {
    try {
        const res = await api.get(`/blogs/${id}`)
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const updateBlog = async (id, data) => {
    try {
        const res = await api.put(`/blogs/${id}`, data,{
        })
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const deleteBlog = async (id) => {
    try {
        const res = await api.delete(`/blogs/${id}`)
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const updateCover = async (id, data) => {
    try {
        const res = await api.patch(`/blogs/coverImage/${id}`, data,{
            headers:{"Content-Type":"multipart/form-data"}
        })
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const likePost = async (id) => {
    try {
        const res = await api.get(`/blogs/${id}/like`)
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const commentPost = async (id, text) => {
    try {
        const res = await api.post(`/blogs/${id}/comment`, {text})
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const getComments = async (id) => {
    try {
        const res = await api.get(`/blogs/${id}/comments`)
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

export { getBlogs, publish, getBlogpost, updateBlog, deleteBlog, updateCover, likePost, commentPost, getComments }