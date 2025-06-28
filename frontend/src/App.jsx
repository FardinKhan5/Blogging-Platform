import { BrowserRouter, Route, Routes } from "react-router-dom"
import ThemeController from "./components/ThemeController"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./utils/ProtectedRoute"
import Layout from "./pages/Layout"
import Profile from "./pages/Profile"
import Blog from "./pages/Blog"
import Dashboard from "./pages/Dashboard"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute><Home /></ProtectedRoute> } />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/edit-post/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="/blog/:id" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
            </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
