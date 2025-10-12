import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import Loading from "./Loading";
import Post from "./Post";

const PostPage = () => {
  const { postId } = useParams();

  const { data: authuser } = useQuery({ queryKey: ["authuser"] });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/posts/${postId}`);
        console.log(res.data);
        return res?.data;
      } catch (error) {
        toast.error.messsage(error.messsage);
      }
    },
    retry: false,
  });

  if (isLoading) return <Loading />;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authuser} />
      </div>

      <div className="hidden lg:block lg:col-span-3">
        <Post key={postId} post={post} />
      </div>
    </div>
  );
};

export default PostPage;
