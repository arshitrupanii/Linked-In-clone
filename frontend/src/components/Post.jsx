import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const PostPage = () => {
	const { postId } = useParams();
	const { data: authuser } = useQuery({ queryKey: ["authuser"] });
    console.log(postId);

	const { data: post, isLoading } = useQuery({
		queryKey: ["posts", postId],
		queryFn: () => axiosInstance.get(`/posts/${postId}`),
	});

	if (isLoading) return <div>Loading post...</div>;   
	if (!post?.data) return <div>Post not found</div>;

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authuser} />
			</div>

			<div className='col-span-1 lg:col-span-3'>
				<Post post={post.data} />
			</div>
		</div>
	);
};
export default PostPage;