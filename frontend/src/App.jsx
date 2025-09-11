import { Route, Routes, Navigate } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import { toast } from 'react-toastify'

import Homepage from "./Pages/Homepage.jsx"
import Loginpage from "./components/auth/Loginpage.jsx"
import SignPage from "./components/auth/Signpage.jsx"
import { ToastContainer } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'

function App() {

  const {data : authuser, isLoading}= useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me")
        return res.data

      } catch (error) {
        if(error.response && error.response.status === 401){
          return null
        }
        toast.error(error.response.status.msg || "something went wrong")
      }
    }
  })

  if(isLoading){
    return <div>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-16 h-16 text-primary"></div>
      </div>
    </div>
  }

  return (
    <Layout>
        <Routes>
          <Route path="/" element={authuser ? <Homepage /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authuser ? <Loginpage /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authuser ? <SignPage /> : <Navigate to={"/"} />} />
        </Routes>
      <ToastContainer />

    </Layout>
  )
}

export default App