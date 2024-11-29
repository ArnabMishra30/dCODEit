import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

export const Contact = mongoose.Model("Contact", contactSchema)