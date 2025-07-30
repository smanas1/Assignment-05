import { Router } from "express";

import * as adminCtrl from "../modules/admin/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/users", adminCtrl.getAllUsers);
router.get("/agents", adminCtrl.getAllAgents);
router.get("/wallets", adminCtrl.getAllWallets);
router.get("/transactions", adminCtrl.getAllTransactions);
router.patch("/user/:id/toggle", adminCtrl.toggleBlockUser);
router.patch("/agent/:id/toggle", adminCtrl.toggleSuspendAgent);

export default router;
