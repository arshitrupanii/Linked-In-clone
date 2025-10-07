import cloudinary from '../lib/cloudinary.js'
import Post from '../model/post.model.js'
import Notifications from '../model/notification.model.js'
import mongoose from 'mongoose'


export const getFeedpost = async (req, res) => {
    // Apne connections aur khud ke posts fetch ho rahe hain.
    try {
        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 })

        res.status(200).json(posts)
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        let newpost;

        if (image) {
            const imgresult = await cloudinary.uploader.upload(image)
            newpost = new Post({
                author: req.user._id,
                content,
                image: imgresult.secure_url
            })
        }
        else {
            newpost = new Post({
                author: req.user._id,
                content
            })
        }

        await newpost.save();
        res.status(201).json(newpost)

    } catch (error) {
        console.log("Error creating post: " + JSON.stringify(error))
        res.status(500).json({ msg: "Failed to create post" })
    }

}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found!" })
        }

        // check if the post has author
        if (post.author.toString() !== userId.toString()) {
            return res.status(401).json({ msg: "You are not author of this post." })
        }

        // delete image from cloudinary if exists
        if (post.image) {
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }

        await Post.findByIdAndDelete(postId)
        res.status(200).json({ msg: "Post deleted successfully" })

    } catch (error) {
        console.log("Error in delete post " + error)
        res.status(500).json({ msg: "Failed to delete post" })
    }
}

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const postValid = mongoose.Types.ObjectId.isValid(postId);

        if(postValid){
            return res.status(404).json({ msg: "Post not found!" })
        }

        const post = await Post.findById(postId)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture username headline")

        if (!post) {
            return res.status(404).json({ msg: "Post not found!" })
        }

        res.status(200).json(post)

    } catch (error) {
        console.log("Error in getpost", error)
        res.status(500).json({ msg: "Failed to get post" })
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comments: { user: req.user._id, content } }
        }, { new: true }).populate("author", "name email username headline profilePicture")

        if (post.author._id.toString() !== req.user._id.toString()) {
            const newNotifications = new Notifications({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })
            await newNotifications.save()

            // this is for send email to 
            try {
				const postUrl = process.env.CLIENT_URL + "/post/" + postId;
				await sendCommentNotificationEmail(
					post.author.email,
					post.author.name,
					req.user.name,
					postUrl,
					content
				);
			} catch (error) {
				console.log("Error in sending comment notification email:", error);
			}
        }
        res.status(200).json(post)

    } catch (error) {
        console.log("error in create comment " + error)
        res.status(500).json({ msg: "Failed to create comment" })
    }
}

export const likepost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;

        if (post.likes.includes(userId)) {
            // unlike the post
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        }

        else {
            // like the post
            post.likes.push(userId);

            const newNotifications = new Notifications({
                recipient: post.author,
                type: "like",
                relatedUser: userId,
                relatedPost: postId
            })

            await newNotifications.save()
        }

        await post.save();
        res.status(200).json(post)

    } catch (error) {
        console.log("error in like post", error)
        res.status(500).json({ msg: "Failed to like post" })
    }

}

