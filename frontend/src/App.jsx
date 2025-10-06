import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import { toast } from "react-toastify";

import Homepage from "./Pages/Homepage.jsx";
import Loginpage from "./components/auth/Loginpage.jsx";
import SignPage from "./components/auth/Signpage.jsx";
import ProfilePage from "./Pages/ProfilePage";


import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";
import NetworkPage from "./Pages/NetworkPage.jsx";

function App() {
  const { data: authuser, isLoading } = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        toast.error(error.response.status.msg || "something went wrong");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authuser ? <Homepage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authuser ? <Loginpage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authuser ? <SignPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/profile/:username"
          element={authuser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/network"
          element={authuser ? <NetworkPage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <ToastContainer />
    </Layout>
  );
}

export default App;
