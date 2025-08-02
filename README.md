# Digital Wallet Management App

## Project Overview

This project is a digital wallet management system built with Node.js, Express, TypeScript, and MongoDB. It allows users to register, manage their wallet, send and receive money, and agents/admins to perform specialized operations. The system supports user authentication, role-based access, and transaction history.

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization (user, agent, admin)
- Wallet management (top-up, withdraw, send money)
- Agent operations (cash-in, cash-out, commission tracking)
- Admin operations (block/unblock users, suspend/activate agents, view all users/wallets/transactions)
- Input validation using Zod
- MongoDB integration via Mongoose

## Tech Stack

- **Backend:** Node.js, Express
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **Validation:** Zod
- **Other:** bcrypt, dotenv, cookie-parser, cors

## API Endpoints

### Auth

- `POST /api/v1/auth/register`  
  Register a new user.  
  **Body:** `{ name, phone, password }`

- `POST /api/v1/auth/login`  
  Login with phone and password.  
  **Body:** `{ phone, password }`

### Wallet

- `POST /api/v1/wallet/top-up`  
  Add money to wallet.  
  **Body:** `{ amount }`

- `POST /api/v1/wallet/withdraw`  
  Withdraw money from wallet.  
  **Body:** `{ amount }`

- `POST /api/v1/wallet/send-money`  
  Send money to another user.  
  **Body:** `{ receiverPhone, amount }`

- `GET /api/v1/wallet/transactions`  
  Get transaction history.

- `GET /api/v1/wallet/balance`  
  Get current wallet balance.

### Agent

- `POST /api/v1/agent/cash-in`  
  Agent cash-in for user.  
  **Body:** `{ userPhone, amount }`

- `POST /api/v1/agent/cash-out`  
  Agent cash-out for user.  
  **Body:** `{ userPhone, amount }`

- `GET /api/v1/agent/commissions`  
  Get agent commission history.

### Admin

- `GET /api/v1/admin/users`  
  Get all users.

- `GET /api/v1/admin/agents`  
  Get all agents.

- `GET /api/v1/admin/wallets`  
  Get all wallets.

- `GET /api/v1/admin/transactions`  
  Get all transactions.

- `PATCH /api/v1/admin/user/block`  
  Block a user.  
  **Body:** `{ userId }`

- `PATCH /api/v1/admin/user/unblock`  
  Unblock a user.  
  **Body:** `{ userId }`

- `PATCH /api/v1/admin/agent/suspend`  
  Suspend an agent.  
  **Body:** `{ userId }`

- `PATCH /api/v1/admin/agent/activate`  
  Activate an agent.  
  **Body:** `{ userId }`

---

**Note:** All wallet, agent, and admin endpoints require authentication and appropriate role
