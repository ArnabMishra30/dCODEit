import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,    //cloudinary url
            required: true
        },
        coverImage: {
            type: String,   //cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'password is required']
        },

        // from here it is taken for my purpose -------------------------------------------------------
        year: {
            type: String,
            required: true,
            enum: ['1', '2', '3', '4']
        },
        dept: {
            type: String,
            required: true,
            enum: ['ece', 'cse', 'me', 'ee']
        },
        role: {
            type: String,
            required: true,
            enum: ['student', 'teacher']
        },
        //to here -------------------------------------------------------------------------------------

        //submitted task...........................
        submissions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Submission"
            }
        ],

        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    //check if password is modified than return otherwise bcrypt it
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//check or compare the password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)