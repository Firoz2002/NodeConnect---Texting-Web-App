import mongoose, { Document, Schema } from "mongoose";

interface IFriendRequest extends Document {
    sentBy: mongoose.Types.ObjectId;
    sentTo: mongoose.Types.ObjectId;
    status: string;
}

const friendRequestSchema: Schema = new Schema({
    sentBy: {
        type: Schema.Types.ObjectId, ref: 'User',
        require
    },
    sentTo: {
        type: Schema.Types.ObjectId, ref: 'User',
        require
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, {timestamps: true});

const FriendRequest = mongoose.model<IFriendRequest>('FriendRequest', friendRequestSchema);
export default FriendRequest;