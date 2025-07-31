import { Router } from "express";

import * as adminCtrl from "../modules/admin/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validation.middleware";
import { userIdSchema } from "../modules/wallet/wallet.validator";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/users", adminCtrl.getAllUsers);
router.get("/agents", adminCtrl.getAllAgents);
router.get("/wallets", adminCtrl.getAllWallets);
router.get("/transactions", adminCtrl.getAllTransactions);

router.patch("/user/block", validate(userIdSchema), adminCtrl.blockUser);
router.patch("/user/unblock", validate(userIdSchema), adminCtrl.unblockUser);

router.patch("/agent/suspend", validate(userIdSchema), adminCtrl.suspendAgent);
router.patch(
  "/agent/activate",
  validate(userIdSchema),
  adminCtrl.activateAgent
);

export default router;
