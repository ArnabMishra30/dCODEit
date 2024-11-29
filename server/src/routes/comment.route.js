import { Router } from 'express';
import {
    addVideoComment,
    deleteVideoComment,
    getVideoComments,
    updateVideoComment,
    updateTweetComment,
    addTweetComment,
    getTweetComments,
    deleteTweetComment,
    addCommentReply
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addVideoComment);
router.route("/c/:commentId").delete(deleteVideoComment).patch(updateVideoComment);

router.route("/tweetcmt/:tweetId").get(getTweetComments).post(addTweetComment);
router.route("/tweetcmt/update/:commentId").delete(deleteTweetComment).patch(updateTweetComment);

//for reply to a comment
router.post("/replies/:parentCommentId", addCommentReply);
export default router