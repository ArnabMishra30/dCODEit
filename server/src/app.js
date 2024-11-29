import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser'
// import multer from 'multer';

const app = express()

//we can define our cors origin resourses which we wanted to allow
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    // Credential: true
    credentials: true // Allow credentials (cookies) to be sentSs
}))

//it is where we set the limit of jso dataupto which we can allow
//in place of it we uses body parser sometimes(old method)
app.use(express.json({
    limit: '16kb'
}))

//URL config
app.use(express.urlencoded({
    extended: true,
    limit: '50kb'
    // limit: '16kb' this is done by youtube
}))

app.use(express.static("public"))

//it is used for so that, from my browser i can access and set cookies for the user bowser
app.use(cookieParser())

//Routes import
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import tweetRouter from "./routes/tweet.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import playlistRouter from "./routes/playlist.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import healthcheckRouter from "./routes/healthcheck.route.js"
import taskRouter from "./routes/task.route.js"
import submissionRouter from "./routes/submission.route.js"

//routes declaration
app.use("/api/v1/users", userRouter) //when we go to (/users) than it sends the control to the file named userRouter
app.use("/api/v1/users/video", videoRouter)
app.use("/api/v1/users/tweets", tweetRouter)
app.use("/api/v1/users/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/task", taskRouter)
app.use("/api/v1/task/submission",submissionRouter)

export { app }