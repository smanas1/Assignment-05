import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  addMoneySchema,
  sendMoneySchema,
} from "../modules/wallet/wallet.validator";
import {
  addMoney,
  getTransactions,
  sendMoney,
  withdrawMoney,
} from "../modules/wallet/wallet.controller";

const router = Router();

router.use(authenticate);

router.post("/top-up", validate(addMoneySchema), addMoney);
router.post("/withdraw", validate(addMoneySchema), withdrawMoney);
router.post("/send-money", validate(sendMoneySchema), sendMoney);
router.get("/transactions", getTransactions);

export default router;
