import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
      },
}, { timestamps: true });

export default mongoose.model('images', imageSchema);