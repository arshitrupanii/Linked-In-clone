import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

const PostPage = () => {
  const { postId } = useParams();

  const { data: user } = useQuery({ queryKey: ["authuser"] });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/posts/${postId}`);
        return res?.data;
      } catch (error) {
        toast.error.messsage(error.messsage);
      }
    },
  });

  if (isLoading) return <div>Loading post...</div>;
  if (!post?.data) return <div>Post not found</div>;

  return (
    <div>
      PostPage
      {/* <pre>{JSON.stringify(post["content"], null, 2)}</pre> */}
    </div>
  );
};

export default PostPage;
