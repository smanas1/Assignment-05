"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminCtrl = __importStar(require("../modules/admin/admin.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const wallet_validator_1 = require("../modules/wallet/wallet.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, (0, role_middleware_1.authorize)("admin"));
router.get("/users", adminCtrl.getAllUsers);
router.get("/agents", adminCtrl.getAllAgents);
router.get("/wallets", adminCtrl.getAllWallets);
router.get("/transactions", adminCtrl.getAllTransactions);
router.patch("/user/block", (0, validation_middleware_1.validate)(wallet_validator_1.userIdSchema), adminCtrl.blockUser);
router.patch("/user/unblock", (0, validation_middleware_1.validate)(wallet_validator_1.userIdSchema), adminCtrl.unblockUser);
router.patch("/agent/suspend", (0, validation_middleware_1.validate)(wallet_validator_1.userIdSchema), adminCtrl.suspendAgent);
router.patch("/agent/activate", (0, validation_middleware_1.validate)(wallet_validator_1.userIdSchema), adminCtrl.activateAgent);
exports.default = router;
