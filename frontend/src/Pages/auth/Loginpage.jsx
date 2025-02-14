import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

const Loginpage = () => {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [checkbox, setcheckbox] = useState(false)
  const [showpassword, setshowpassword] = useState(false)

  const queryClient = useQueryClient();

  const { mutate: loginMutate } = useMutation({
    mutationFn: async (userdata) =>  axiosInstance.post("/auth/login",userdata),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.msg)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (email === "" || password === "") {
      toast.error("Please fill the form")
      return
    }
    if (checkbox === false) {
      toast.error("Please check the box")
      return
    }

    loginMutate({ email, password })
  }

  return (
    <div className="min-h-screen">
      <div>
        <img className="h-32" src="/logo.svg" alt="" />
      </div>

      {/* this is white page */}
      <div className="flex justify-center">
        <div className="w-[550px] flex flex-col bg-white p-7 gap-4 rounded-2xl">
          <h2 className="text-[37px] font-light">Sign In</h2>

          <div className="flex flex-col gap-5">
            <label className="absolute px-2 py-1" htmlFor="">Email or phone number</label>
            <input value={email} onChange={(e) => setemail(e.target.value)} className="border-black border-2 rounded-md pt-7 pb-2 px-2" type="text" />

            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  className="border-black border-2 rounded-md py-2 px-2 w-full pr-10"
                  type={showpassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute text-xl right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={() => setshowpassword(!showpassword)}
                >
                  {showpassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <p className="text-primary text-lg">Forgot password?</p>

          <div className="flex gap-2 my-2 text-center items-center">
            <input onChange={() => setcheckbox(!checkbox)} className="cursor-pointer" type="checkbox" name="" id="" />
            <label htmlFor="checkbox">Keep me logged in </label>
          </div>


          <div className="flex justify-center items-center">
            <button onClick={handleSubmit} className="bg-primary bg-opacity-95 hover:bg-primary w-[85%] rounded-3xl text-[20px] h-full p-2 text-white" type="submit">Sign In</button>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <hr className="w-1/3" /><p>or</p><hr className="w-1/3" />
          </div>

          <p className="text-gray-500 px-2 text-center">By clicking Agree & Join, you agree to the LinkedIn <span className="text-primary">User Agreement, Privacy Policy</span>, and <span className="text-primary">Cookie Policy.</span></p>

          <div className='flex flex-col gap-16 items-center'>
            <button className="flex items-center w-[80%] justify-center px-4 py-2 bg-white border border-gray-300 shadow-md rounded-lg text-gray-700 hover:bg-gray-100">
              <FcGoogle className="text-3xl mr-2" /> Sign in with Google
            </button>
            <p className="text-center">Create new account? <Link to={"/signup"} className="text-primary">Sign in</Link></p>
          </div>

        </div>
      </div>
      <p className="text-center mt-5">Looking to create a page for business? <span className="text-primary">Get help</span></p>
      <ToastContainer />
    </div>

  )
}

export default Loginpage
