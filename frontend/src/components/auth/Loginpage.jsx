import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { data, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import "react-toastify/dist/ReactToastify.css";

const Loginpage = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: loginMutate } = useMutation({
    mutationFn: async (userdata) => axiosInstance.post("/auth/login", userdata),
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please fill the form");
      return;
    }

    loginMutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* this is white page */}
      <div className="flex justify-center">
        <div className="w-[550px] flex flex-col bg-secondary p-7 gap-4 rounded-2xl">
          <h2 className="text-[37px] font-light">Sign In</h2>

          <div className="flex flex-col gap-5">
            <label className="absolute px-2 py-1" htmlFor="">
              Email or phone number
            </label>
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="border-black bg-base-200 border-2 rounded-md pt-7 pb-2 px-2"
              type="text"
            />

            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  className="border-black bg-base-200 border-2 rounded-md py-2 px-2 w-full pr-10"
                  type={showpassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
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

          <div className="flex justify-center items-center">
            <button
              onClick={handleSubmit}
              className="bg-primary bg-opacity-95 hover:bg-primary w-[85%] rounded-3xl text-[20px] h-full p-2 text-white"
              type="submit"
            >
              Sign In
            </button>
          </div>

          <div className="flex flex-col gap-16 items-center">
            <p className="text-center">
              Create new account?{" "}
              <Link to={"/signup"} className="text-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Loginpage;
