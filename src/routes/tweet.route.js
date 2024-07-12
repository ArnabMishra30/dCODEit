import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route("/").post(createTweet);
router.route("/")
    .post(upload.single('image'), createTweet) // Apply multer middleware here
    .get(getAllTweets); // Apply verifyJWT middleware here
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId")
    .patch(upload.single('image'), updateTweet)
    .delete(deleteTweet);

export default router