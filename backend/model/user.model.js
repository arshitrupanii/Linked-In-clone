import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    bannerImg: {
        type: String,
        default: '',
    },
    headline: {
        type: String,
        default: 'Linked In User',
    },
    Location: {
        type: String,
        default: 'India',
    },
    about: {
        type: String,
        default: '',
    },
    skills: [String],
    experience: [
        {
            title: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String,
        }
    ],
    education: [
        {
        school: String,
        fieldofStudy: String,
        startDate: Number,
        endDate: Number,
        }
    ],
    connections : [{
        type: mongoose.Schema.Types.ObjectId , ref:"User"
    }]


},{
    timestamps:true,
})

const User = mongoose.model("User", userSchema)

export default User;