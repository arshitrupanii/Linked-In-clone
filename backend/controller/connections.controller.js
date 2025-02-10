import ConnectionRequest from "../model/connectionsRequest.model.js"

export const sendConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.params;
        const senderId = req.user._id;

        if(senderId.toString() === userId){
            return res.status(400).json({msg : "You can't send request to yourself."})
        }

        if(req.user.connections.includes(userId)){
            return res.status(400).jsong({msg : "You already Connected "})
        }

        const existingRequest = await ConnectionRequest.findOne({
            sender : senderId,
            recipient : userId,
            status : "pending",
        })

        if(existingRequest){
            return res.status(400).json({msg : "A connection request already exists"})
        }

        const newrequest = new ConnectionRequest({
            sender : senderId,
            recipient : userId
        })

        await newrequest.save();

        res.status(400).json({msg : "Connection request sent successfully"})

    } catch (error) {
        console.log("error in send connections request : "+ error)
        res.status(500).json({msg : error.message})
    }
}

