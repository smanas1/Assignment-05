import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { agentTransactionSchema } from "../modules/wallet/wallet.validator";
import { cashIn, cashOut } from "../modules/agent/agent.controller";
import { validate } from "../middlewares/validation.middleware";

const router = Router();

router.use(authenticate, authorize("agent"));

router.post("/cash-in", validate(agentTransactionSchema), cashIn);
router.post("/cash-out", validate(agentTransactionSchema), cashOut);

export default router;
