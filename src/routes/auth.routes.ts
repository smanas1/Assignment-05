import { Router } from "express";
import { validate } from "../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../modules/auth/auth.validator";
import { login, register } from "../modules/auth/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
