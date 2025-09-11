import Notification from "../model/notification.model.js"

export const getusernotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedUser", "content image")

        res.status(200).json(notifications)

    } catch (error) {
        console.log("error in getusernotifications : " + error)
        res.status(500).json({ msg: "error in get user notifications " })
    }
}

export const Notificationasread = async (req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notification.findOneAndUpdate(
            {_id : notificationId, recipient : req.user._id},
            {read: true},
            {new : true}
        )
        
        res.json(notification)
    } catch (error) {
        console.log("error in Notificationasread : " + error)
        res.status(500).json({ msg: "error in Notificationasread " })
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    try {
        await Notification.findOneAndDelete({
            _id : notificationId,
            recipient : req.user._id
        })
        
        res.json({msg : "Notification is deleted successfully."})

    } catch (error) {
        console.log("error in deleteNotification : " + error)
        res.status(500).json({ msg: "error in deleteNotification " })
    }
}
