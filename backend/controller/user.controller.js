import User from "../model/user.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getSuggestedConnections = async (req, res) => {

    try {
        const currentUser = await User.findById(req.user._id).select("connections")


        const SuggestUser = await User.find({
            _id:{
                $ne : req.user._id, $nin : currentUser.connections
            }
        }).select("name username profilePicture headline").limit(3)
        
        res.json(SuggestUser)


    } catch (error) {
        console.log("error in getsuggested Connections : " + error)
        res.status(500).json({msg: "the error in getsuggested connections. "})
    }

}

export const getPublicProfile = async (req, res) => {

    try {
        const user = await User.findOne({username : req.params.username}).select("-password")    

        if (!user) {
            return res.status(404).json({msg : "User not found! "})
        }

        res.json(user)

    } catch (error) {
        console.log("error in getPublicProfile  : " + error)
        res.status(500).json({msg: "the error in getPublicProfile. "})

    }
}

export const updateProfile = async (req, res) => {

    try {
        const allowedFields = [
            "name",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education"
        ]

        const updateData = {};

        if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture)
            updateData.profilePicture = result.secure_url
        }
        
        if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg)
            updateData.bannerImg = result.secure_url
        }

        for(const field of allowedFields){
            if(req.body[field]){
                updateData[field] = req.body[field]
            }
        }

        const user = await User.findByIdAndUpdate(req.user._id, {$set: updateData}, {new : true}).select("-password")

        res.json(user)
        
    } catch (error) {
        console.log("error in updateProfile  : " + error)
        res.status(500).json({msg: "the error in updateProfile. "})

    }
}
