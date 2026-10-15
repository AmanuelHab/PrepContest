import express from "express";
import { checkUser, getProblems } from "./controller.js";

const router = express.Router();

router.get('/check/:handle', checkUser);
router.post('/get_problems', getProblems);

export default router;