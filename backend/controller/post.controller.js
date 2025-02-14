import cloudinary from '../lib/cloudinary.js'
import Post from '../model/post.model.js'
import Notifications from '../model/notification.model.js'


export const getFeedpost = async (req,res) => {
    try {
        const posts = Post.find({authon: {$in : [...req.user.connections, req.user._id]}})
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture")
        .sort({createdAt : -1})

        res.status(200).json(posts)


    } catch (error) {
        
    }
}

export const createPost = async (req, res) => {
    try {
        const {content, image} = req.body;
    
        let newpost;

        if(image){
            const imgresult = await cloudinary.uploader.upload(image)
            newpost = Post({
                author: req.user._id,
                content,
                image: imgresult.secure_url
            })
        }
        else{
            newpost = new Post({
                author: req.user._id,
                content
            })
        }

        await newpost.save();
        res.status(201).json(newpost)
        
    } catch (error) {
        console.log("Error creating post: " + error)
        res.status(500).json({msg: "Failed to create post"})
    }

}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.post;
        const userId = req.params._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({msg: "Post not found!"})
        }

        // check if the post has author
        if (post.author.toString()!== userId.toString()) {
            return res.status(401).json({msg: "You are not author of this post."})
        }

        // delete image from cloudinary if exists
        if (post.image) {
            await cloudinary.uploader.destroy(post.image.split('/').pop().split('.')[0])
        }

        await Post.findByIdAndDelete(postId)
        res.status(200).json({msg: "Post deleted successfully"})

    } catch (error) {
        console.log("Error in delete post " + error)
        res.status(500).json({msg: "Failed to delete post"})
    }
}

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        .populate("author","name username profilePicture headline")
        .populate("comments.user", "name profilePicture username headline")

        if (!post) {
            return res.status(404).json({msg: "Post not found!"})
        }

        res.status(200).json(post)

    } catch (error) {
        console.log("Error in getpost " + error)
        res.status(500).json({msg: "Failed to get post"})
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = req.params.post;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comments: { user: req.user._id, content } }
        }, { new: true }).populate("author", "name email username headline profilePicture")

        if(post.author.toString() !== req.user._id.toString()) {
            const newNotifications = new Notifications({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost : postId
            })
            await newNotifications.save()
        }

        res.status(201).json(post)

    } catch (error) {
        console.log("error in create comment " + error)
        res.status(500).json({msg: "Failed to create comment"})
    }
}

export const likepost = async(req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;

        if(post.likes.includes(userId)){
            // unlike the post
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        }

        else{
            // like the post
            post.likes.push(userId);

            const newNotifications = new Notifications({
                recipient: post.author,
                type: "like",
                relatedUser: userId,
                relatedPost : postId
            })

            await newNotifications.save()
        }

        await post.save();
        res.status(200).json(post)

    } catch (error) {
        console.log("error in like post", error)
        res.status(500).json({msg: "Failed to like post"})
    }

}

