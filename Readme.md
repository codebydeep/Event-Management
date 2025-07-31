# Event Management API

This is a RESTful API for event creation and registration using Node.js, Express, PostgreSQL with Prisma ORM, and Docker.

---

## Features

- Create and list events
- Register and cancel users
- View event stats
- Many-to-many relationship between users and events
- Complete Dockerized setup (no need to install PostgreSQL manually)

---

## ⚙️ Tech Stack

- Node.js + Express
- PostgreSQL (via Docker)
- Prisma ORM
- Docker (for database)

---

## 🚀 Getting Started

### Project Folder Structure
```bash
event-management-api/
├── prisma/
│   ├── schema.prisma        
│   └── migrations/          
│
├── src/
│   ├── controllers/
│   │   └── eventController.js   
│   │
│   ├── routes/
│   │   └── eventRoutes.js       
│   │
│   ├── libs/
│   │   └── db.js                
│   │
│   └── index.js                 
├── .env                         
├── .env.example                         
├── .gitignore                 
├── package.json                
├── README.md                    
```

 ## ✅ Prerequisites

1. **Clone the repository:**

```bash
git clone https://github.com/codebydeep/Event-Management.git

```
2. Install Dependencies
```bash
npm install
```

3. Start PostgreSQL in Docker

```bash
docker run --name postgres 
  -e POSTGRES_USER=youruser 
  -e POSTGRES_PASSWORD=yourpassword 
  -p 5432:5432 
  -d postgres
```
4. Create .env file from .env.example
```bash
DATABASE_URL="postgresql://youruser:yourpassword@localhost:5432/eventdb?schema=public"
PORT=3000
```

5. Run Prisma Commands
```bash
npx prisma generate
npx prisma migrate dev
```

6. Start the server
```bash
Start the server:
```

