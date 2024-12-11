import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getPassword,
  getUsersForSidebar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
// router.get("/password/:id", protectAdminRoute, getPassword);

export default router;
