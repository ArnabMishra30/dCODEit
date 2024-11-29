import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createSubmission, deleteSubmission, getAllSubmissions } from '../controllers/submission.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT);// Apply verifyJWT middleware to all routes in this file

router.route("/:taskId/").post(upload.single('screenshot'), createSubmission);
router.route("/answer/:taskId/").get(getAllSubmissions);
// router.route("/answer/:submissionId/:userId").get(getUserSubmissions);
router.route("/:taskId/:submissionId").delete(deleteSubmission);

export default router;