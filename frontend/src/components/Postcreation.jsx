import { useState } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import { toast } from "react-toastify"
import { Loader, Image } from "lucide-react"

const Postcreation = ({ user }) => {
    const [content, setcontent] = useState("")
    const [image, setimage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const queryClient = useQueryClient()

    const { mutate: createPostMutation, isPending  } = useMutation({
        mutationKey: "createPost",
        mutationFn: async (Postdata) => {
            const res = await axiosInstance.post("/posts/create", Postdata, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            return res.data
        },
        onSuccess: () => {
            toast.success("Post created successfully!")
            resethandler()
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        },
        onError: (error) => {
            toast.error("Error creating post: " + error.response.data.msg || "failed to create post")
        }
    })

    const handlePostCreation = async () => {
        try {
            const postdata = { content }
            if (image) {
                postdata.image = image
            }
            createPostMutation(postdata)
        } catch (error) {
            console.log(error)
        }
    }

    const resethandler = () => {
        setcontent("")
        setimage(null)
        setImagePreview(null)
    }

    const handleImageChange = (e) => {
		const file = e.target.files[0];
		setimage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};



    return (
        <div>
            <div className='bg-secondary rounded-lg shadow mb-4 p-4'>
                <div className='flex space-x-3'>
                    <img src={user.profilePicture || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
                    <textarea
                        placeholder="What's on your mind?"
                        className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
                        value={content}
                        onChange={(e) => setcontent(e.target.value)}
                    />
                </div>

                {imagePreview && (
                    <div className='mt-4'>
                        <img src={imagePreview} alt='Selected' className='w-full h-auto rounded-lg' />
                    </div>
                )}

                <div className='flex justify-between items-center mt-4'>
                    <div className='flex space-x-4'>
                        <label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
                            <Image size={20} className='mr-2' />
                            <span>Photo</span>
                            <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                        </label>
                    </div>

                    <button
                        className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
                        onClick={handlePostCreation}
                        disabled={isPending}
                    >
                        {isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Postcreation 