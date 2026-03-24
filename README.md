<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="SocketIO" />
  <br>
  <h1>💬 Chat Message App Backend</h1>
  <p><b>Realtime Chat Application Backend</b></p>
</div>

## 🚀 Project Overview

A backend server for a cross-platform real-time chat application. Built for secure, fast, and scalable messaging experiences.

**Key Features:**

- 🛡️ **Auth & Security:** JWT, Google OAuth, and OTP verification.
- 💬 **Realtime Chat:** Instant messaging with Socket.IO.
- 👥 **Friendships & Anti-spam:** Built-in connection management.
- 🗂️ **Group & Direct Chat:** Supports mutations, pinning, and media attachments via `Cloudinary`.
- ⚡ **Background Processing:** Async tasks and email queues handled by `BullMQ` & `Redis`.

---

## 🛠 Core Stack

| Layer           | Tech Stack                    | Purpose                                 |
| --------------- | ----------------------------- | --------------------------------------- |
| **Framework**   | NestJS v11, TypeScript        | Core logic, DI, Controllers             |
| **Database**    | PostgreSQL, TypeORM           | Relational data storage                 |
| **Cache/Queue** | Redis, BullMQ                 | Caching, request limits, mail queues    |
| **Realtime**    | Socket.IO                     | Sockets connection & Event broadcasting |
| **Security**    | PassportJS (Local/JWT/Google) | Auth guards & endpoint protection       |
| **Storage**     | Cloudinary, Multer            | Media attachments and avatars           |

---

## 🏗 Database Architecture

```bash
    Users             ||--o{    Participants : "has"
    Users             ||--o{    Messages : "sends"
    Users             ||--o{    Friendships : "requests"
    Users             ||--o{    Friendships : "receives"
    Users             ||--o{    AccountHistory : "logs in"
    Users             ||--o{    AuditLogs : "performs action"
    Users             ||--o{    MessagePins : "pins"

    Conversations     ||--o{    Participants : "includes"
    Conversations     ||--o{    Messages : "contains"
    Conversations     ||--o{    MessagePins : "has pins"

    Messages          ||--o{    MessageAttachments : "includes media"
    Messages          ||--o{    MessagePins : "is pinned"

    EmailLogs { }
    SystemConfigs { }
```

---

## 🔄 Logical Flows

### 1. Authentication Flow

Secure OTP-based registration and verification process.

```bash
    User        ->>   AuthAPI: register(Email, Password)
    AuthAPI     ->>   Redis: Save OTP (TTL 5m)
    AuthAPI     ->>   MailQueue: Enqueue Email Job
    MailQueue   ->>   User: Send OTP Email
    User        ->>   AuthAPI: verifyOTP(OTP)
    AuthAPI     ->>   Users Database: Activate Account
    AuthAPI     ->>   User: Return Tokens (Access/Refresh)
```

### 2. Realtime Messaging

Real-time message broadcasting and unread counts updates.

```bash
    UserA           ->>   SocketServer: 'send_message' (Room ID)
    SocketServer    ->>   Postgres(DB): Persist Message
    SocketServer    ->>   Redis(Cache): Increment Unread Count
    SocketServer    ->>   UserB: Broadcast 'new_message'
    UserB           ->>   SocketServer: 'read_message'
    SocketServer    ->>   Postgres(DB): Update Read Receipts
```

### 3. Friendship Mechanisms

System-enforced limits help prevent message spamming to unknown users.

- Daily request limits apply to friend invitations.
- Connections remain `PENDING` until mutually accepted.
- Non-friends have restricted messaging quotas.

---

## 🚀 Setup & Execution

### 1. Requirements

- **Node.js**: >= 18
- **Package Manager**: Yarn or NPM
- **Services**: PostgreSQL, Redis

### 2. Installation

Clone, install dependencies, and setup the environment.

```bash
yarn install
cp .env.example .env
```

Configure `.env` with your desired credentials:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=chat_message_app

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Tokens
JWT_SECRET_KEY=secret
JWT_REFRESH_SECRET_KEY=refresh_secret
```

### 3. Running Services

**Run Migrations:**

```bash
yarn migration:run
```

_(To generate new migrations: `yarn migration:generate`)_

**Start Development Server:**

```bash
yarn dev
```

**Production Build:**

```bash
yarn build
yarn start
```

---

## 📖 API Documentation (Swagger)

A built-in **Swagger UI** allows for rapid API endpoint testing.

- **Link**: `http://localhost:<PORT>/api/docs`
- Requirement: `SWAGGER_PATH=api/docs` set in `.env`.

---

## 🤝 Contributing

I welcome your PRs to improve architecture, optimize queries, or fix bugs! Open an issue before large refactors. Happy coding! 🎉
