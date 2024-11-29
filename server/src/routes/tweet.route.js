// import { Router } from 'express';
// import {
//     createTweet,
//     deleteTweet,
//     getUserTweets,
//     getAllTweets,
//     updateTweet,
// } from "../controllers/tweet.controller.js"
// import { verifyJWT } from "../middlewares/auth.middleware.js"
// import { upload } from '../middlewares/multer.middleware.js';

// const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// // router.route("/").post(createTweet);
// router.route("/")
//     .post(upload.single('image'), createTweet) // Apply multer middleware here
//     .get(getAllTweets); // Apply verifyJWT middleware here
// router.route("/user/:userId").get(getUserTweets);
// router.route("/:tweetId")
//     .patch(upload.single('image'), updateTweet)
//     .delete(deleteTweet);

// export default router

import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
    getTweetById
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Apply verifyJWT middleware only to routes that require authentication
router.route("/")
    .post(verifyJWT, upload.single('image'), createTweet)
    .get(getAllTweets);

router.route("/user/:userId")
    .get(verifyJWT, getUserTweets);

router.route("/:tweetId")
    .get(verifyJWT, getTweetById)  // Add this line to handle GET requests for fetching a tweet by ID
    .patch(verifyJWT, upload.single('image'), updateTweet)
    .delete(verifyJWT, deleteTweet);

export default router;
