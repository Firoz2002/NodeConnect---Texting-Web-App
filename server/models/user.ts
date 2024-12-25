import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profile?: string;
    friends: mongoose.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema({
    username: {
        min: 3,
        max: 30,
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String
    }, 
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true});

const User = mongoose.model<IUser>('User', userSchema);
export default User;