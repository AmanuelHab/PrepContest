import express from "express";
import { checkUser } from "./controller";

const router = express.Router();

router.get('/check', checkUser);
router.get('/find_problems');

export default router;