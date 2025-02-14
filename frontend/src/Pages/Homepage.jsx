import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import { toast } from "react-toastify"
import Sidebar from "../components/Sidebar"

const Homepage = () => {
  const { data: authuser } = useQuery({ queryKey: ['authuser'] })

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/user/suggestions")
        return res.data
      } catch (error) {
        toast.error(error.response.data.msg)
      }
    }
  })

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/posts")
        return res.data
      } catch (error) {
        toast.error(error.response.data.msg)
      }
    }
  })

  console.log("recommendedUsers", recommendedUsers)
  console.log("posts", posts)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
       <div className="hidden lg:block lg:col-span-1">
        <Sidebar user = {authuser}/>
        
       </div>
    </div>
  )
}

export default Homepage
