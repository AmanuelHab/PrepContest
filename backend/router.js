import express from "express";
import { checkUser } from "./controller.js";

const router = express.Router();

router.get('/check/:handle', checkUser);
// router.get('/find_problems');

export default router;