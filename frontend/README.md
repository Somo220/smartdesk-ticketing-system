# SmartDesk – IT Support Ticketing System

A modern full-stack IT Support Ticketing System built using **Spring Boot**, **PostgreSQL**, and **Next.js**. The project enables users to create and track support tickets while allowing admins and support agents to manage and resolve them efficiently.

---

# 🚀 Features

## 🔐 Authentication & Security
- JWT-based authentication
- Role-based authorization (ADMIN / AGENT / USER)
- Spring Security integration
- Protected frontend routes

## 🎫 Ticket Management
- Create support tickets
- View ticket history
- Ticket status updates
- Priority management
- Ticket assignment workflow

## 👤 User Management
- Admin dashboard
- User listing
- Role handling
- Secure API access

## 📊 Dashboard & Analytics
- Ticket statistics overview
- Status visualization
- Responsive dashboard UI
- Modern SaaS-inspired design

## 🎨 Frontend Features
- Next.js App Router
- Tailwind CSS
- Dark/Light mode
- Glassmorphism UI
- Framer Motion animations
- Responsive layout

---

# 🛠️ Tech Stack

## Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Maven
- PostgreSQL
- JWT Authentication
- Swagger / OpenAPI

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Framer Motion
- React Hot Toast

---

# 📁 Project Structure

```bash
SmartDesk/
│
├── backend/        # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── application.yml
│
├── frontend/       # Next.js Frontend
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

# ⚙️ Backend Setup

## 1️⃣ Install Requirements
- Java 17
- Maven 3.8+
- PostgreSQL 15+

## 2️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/smartdesk.git
cd smartdesk
```

## 3️⃣ Configure Database

Create a PostgreSQL database:

```sql
CREATE DATABASE smartdesk;
```

Update:

```bash
backend/src/main/resources/application.yml
```

Example:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smartdesk
    username: postgres
    password: postgres
```

---

## 4️⃣ Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

---

# 🌐 Frontend Setup

## 1️⃣ Install Requirements
- Node.js 18+
- npm

## 2️⃣ Install Dependencies

```bash
cd frontend
npm install
```

## 3️⃣ Run Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 🔑 Sample Login Credentials

## Admin
```text
Username: admin
Password: admin123
```

## Agent
```text
Username: agent
Password: agent123
```

## User
```text
Username: user
Password: user123
```

---

# 🔐 API Authentication

After login, copy the JWT token and use:

```text
Bearer YOUR_TOKEN
```

in Authorization headers.

---

# 🧠 Challenges Faced

During development, several real-world challenges were encountered and resolved:

- Java version compatibility issues (Java 25 → Java 17)
- Maven environment setup
- PostgreSQL integration and connection handling
- JWT token management
- Frontend-backend API integration
- Tailwind CSS configuration issues
- DTO payload mismatches between frontend and backend

These challenges improved debugging, integration, and full-stack development skills.

---

# 🎯 Future Improvements

- Real-time notifications
- Email integration
- File upload support
- Advanced analytics dashboard
- WebSocket integration
- Docker deployment
- CI/CD pipeline

---

# 📸 Screenshots

> Add screenshots of:
- Login page
- Dashboard
- Tickets page
- Swagger UI
- Dark mode UI

---

# 👨‍💻 Author

**Soumyadip Maiti**

- Full Stack Developer
- Java & Spring Boot Enthusiast
- Next.js & UI/UX Learner

---

# ⭐ Final Note

SmartDesk was built as a production-style full-stack project to learn backend architecture, secure authentication, API integration, and modern frontend design principles.
