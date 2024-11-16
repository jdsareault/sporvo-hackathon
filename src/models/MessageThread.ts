import mongoose from 'mongoose'

const messageThreadSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    lastMessage: {
        content: String,
        timestamp: Date,
    },
}, {
    timestamps: true,
})

const MessageThread = mongoose.models.MessageThread || mongoose.model('MessageThread', messageThreadSchema)
export default MessageThread 