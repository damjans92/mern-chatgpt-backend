import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
const ChatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID(),
    },
    role: {
        type: String,
        reuired: true,
    },
    content: {
        type: String,
        reuired: true,
    },
});
const UserSchema = new mongoose.Schema({
    name: {
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
    chats: [ChatSchema],
});
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map