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


## 📮 API Endpoints
```
`http://localhost:3000/events/`Routes
```
---

### 1. Create Event

- **Method:** `POST`  
- **Route:** `/create-event`  
- **Description:** Creates a new event with title, dateTime, location, and capacity.

#### 📤 Request Body:
```json
{
  "title": "Web dev Bootcamp",
  "dateTime": "2025-08-15T10:00:00.000Z",
  "location": "Mumbai",
  "capacity": 100
}
```

### 2. Get All Events

- **Method:** `GET`  
- **Route:** `/get-events`  
- **Description:** Get all the Events.

#### 3. Register for Event

- **Method:** `POST`
- **Route:** `/register-event`
- **Description:** Registers a user for a specific event.

### 4. Cancel Registration
- **Method:** `DELETE`
- **Route:** `/cancel-event`
- **Description:** Cancels a user registration for an event.

####  Request Body:
```json
{
  "email": "deep@example.com",
  "eventId": "replace-with-event-id"
}
```

### 5. List of Upcoming Events
- **Method:** `GET`
- **Route:** `/get-upcoming-events`
- **Description:** Returns all future events sorted by date and location.


### 6. Event Stats
- *Method:* `GET`
- *Route:* `/stats/:eventId`
- *Description:* Returns stats for a specific event
