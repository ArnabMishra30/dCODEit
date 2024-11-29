import { Router } from 'express';
import { createTask, deleteTask, getAllTasks, updateTask, getUserTasks } from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);// Apply verifyJWT middleware to all routes in this file

router.route("/").post(createTask);
router.route("/").get(getAllTasks);
router.route("/user/:userId").get(getUserTasks);
router.route("/:taskId").patch(updateTask);
router.route("/:taskId").delete(deleteTask);

export default router;