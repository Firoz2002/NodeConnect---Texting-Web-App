import mongoose, { Document, Schema} from "mongoose";

interface IRoom extends Document {
    user1: string,
    user2: string,
}

const roomSchema: Schema<IRoom> = new Schema({
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Room = mongoose.model<IRoom>('Room', roomSchema);
export default Room;