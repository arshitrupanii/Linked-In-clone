import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import { toast } from "react-toastify";

import Homepage from "./Pages/Homepage.jsx";
import ProfilePage from "./Pages/ProfilePage";
import Notification from "./Pages/Notificaion.jsx";
import Loginpage from "./components/auth/Loginpage.jsx";
import SignPage from "./components/auth/Signpage.jsx";

import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";
import NetworkPage from "./Pages/NetworkPage.jsx";
import PostPage from "./components/PostPage.jsx";
import Loading from "./components/Loading.jsx";

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

  if (isLoading) return <Loading />;

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
        <Route
          path="/notifications"
          element={authuser ? <Notification /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/post/:postId"
          element={authuser ? <PostPage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <ToastContainer />
    </Layout>
  );
}

export default App;
