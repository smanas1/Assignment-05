"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
const agent_routes_1 = __importDefault(require("./routes/agent.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/wallet", wallet_routes_1.default);
app.use("/api/v1/agent", agent_routes_1.default);
app.use("/api/v1/admin", admin_routes_1.default);
app.get("/", (req, res) => {
    res.send("Welcome TO Wallet Management App");
});
exports.default = app;
