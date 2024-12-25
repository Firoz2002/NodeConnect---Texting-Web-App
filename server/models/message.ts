import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
    sendBy: string;
    message: string;
    sendTo: string;
}

const messageSchema: Schema = new Schema({
    sendBy: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sendTo: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;