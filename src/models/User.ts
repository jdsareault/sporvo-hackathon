import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['STUDENT', 'MENTOR'],
        required: true
    },
    school: String,
    grade: String
}, {
    timestamps: true
})

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User 