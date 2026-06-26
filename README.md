# Smart Society Management System

## How to Run

### Step 1 - Backend Setup
```
cd backend
npm install
npm start
```
Backend will run on: http://localhost:5000

### Step 2 - Frontend Setup (new terminal)
```
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

### Step 3 - MongoDB
Make sure MongoDB is running locally on your PC.
Or install it from: https://www.mongodb.com/try/download/community

## Default Test Users (register manually)
- Admin: role = admin
- Resident: role = resident  
- Security: role = security
- Maintenance: role = maintenance

## Project Structure
```
backend/
  config/       - DB connection
  controllers/  - Business logic
  middleware/   - Auth & upload
  models/       - MongoDB schemas
  routes/       - API routes
  uploads/      - Uploaded images
  server.js     - Entry point

frontend/
  src/
    components/ - Reusable UI
    pages/      - All screens
    redux/      - State management
    services/   - API calls
```
