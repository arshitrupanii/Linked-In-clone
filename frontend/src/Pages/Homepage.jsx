import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Postcreation from "../components/Postcreation";
import PostPage from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const Homepage = () => {
  const { data: authuser } = useQuery({ queryKey: ["authuser"] }); // authuser is new variable in that

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/user/suggestions");
        return res.data;
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authuser} />
      </div>

      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <Postcreation user={authuser} />
        {posts?.map((post) => (
          <PostPage key={post._id} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>

      <div>
        {recommendedUsers?.length > 0 && (
          <div className="col-span-1 lg:col-span-1 hidden lg:block">
            <div className="bg-secondary rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">People you may know</h2>
              {recommendedUsers?.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
