import api from "./axios"

const registerUser = async (username, email, password) => {
    try {
        const res = await api.post("/auth/register", {
            username,
            email,
            password
        })
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const login = async (email, password) => {
    try {
        const res = await api.post("/auth/login", {
            email,
            password
        })
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const logout = async () => {
    try {
        const res = await api.get("/auth/logout")
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const getProfile = async () => {
    try {
        const res = await api.get("/auth/profile")
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const updateProfile = async (data) => {
    try {
        const res = await api.patch("/auth/profile", data)
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

const updateAvatar = async (formData) => {
    try {
        const res = await api.patch("/auth/profile/avatar", formData,{
            headers:{"Content-Type":"multipart/form-data"}
        })
        return res.data.data
    } catch (error) {
        console.log(error.response.data.message)
        throw error
    }
}

export { registerUser, login, logout,getProfile, updateProfile, updateAvatar }