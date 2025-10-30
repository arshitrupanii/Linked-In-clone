import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";

const SignPage = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: SignUpMutate } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("auth/signup", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });

  const handleSubmit = (e) => {
    const username = email.split("@")[0];
    const name = email.split("@")[0];

    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill the form");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.match(emailPattern)) {
      toast.error("Invalid email");
      return;
    }

    if (password.length < 6 || password.length > 20) {
      toast.error("Password must contain at least 6 or more characters");
      return;
    }

    setemail("");
    setpassword("");
    SignUpMutate({ name, username, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/*  */}
      <div className="w-full flex justify-center items-center flex-col gap-9">
        {/* this is white page */}
        <div className="w-[550px] flex flex-col bg-secondary p-7 gap-4 rounded-2xl">
          <h2 className="text-[37px] font-light">Register</h2>

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

          <div className="flex mt-9 justify-center items-center">
            <button
              onClick={handleSubmit}
              className="bg-primary bg-opacity-90 w-[85%] hover:bg-primary rounded-3xl text-[20px] h-full p-2 text-white"
              type="submit"
            >
              Agree & join
            </button>
          </div>

          <div className="flex flex-col gap-16 items-center">
            <p className="text-center">
              Already on LinkedIn?{" "}
              <Link to={"/login"} className="text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignPage;
