# How to Run Kenya Youth Opportunity Hub (MERN Stack)

## Prerequisites

Before running the application, ensure you have installed:
1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (local or cloud) - [Download here](https://www.mongodb.com/try/download/community) OR use MongoDB Atlas

## Running the Application

### Option 1: Run Both Backend and Frontend Together

You need TWO terminal windows open:

#### Terminal 1 - Backend (Port 4000)
```bash
cd Backend
npm install
npm start
```

#### Terminal 2 - Frontend (Port 5173)
```bash
cd Frontend
npm install
npm run dev
```

### Option 2: Install MongoDB Locally

1. Download and install MongoDB Community Server
2. Start MongoDB service:
   ```bash
   mongod
   ```
3. The backend will connect to `mongodb://localhost:27017/eyob`

### Option 2: Use MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Create a `.env` file in the Backend folder:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=4000
   ```

## Access the Application

- **Frontend**: Open http://localhost:5173 in your browser
- **Backend API**: http://localhost:4000/api

## Quick Start Script

Run both servers with one command:

```bash
# Install dependencies first
cd Backend && npm install
cd ../Frontend && npm install
cd ..

# Run backend (in one terminal)
cd Backend && npm start

# Run frontend (in another terminal)
cd Frontend && npm run dev
```

## Troubleshooting

### Port Already in Use
If you get port errors, change the port in:
- Backend: Edit `Backend/index.js` - change `4000` to another port
- Frontend: Edit `Frontend/vite.config.js` - change the port

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `.env` file configuration
- For local MongoDB, ensure the service is started

### Node Modules Issues
If you encounter errors, delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file in the Backend folder:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/eyob
JWT_SECRET=your_secret_key_here
```

## Next Steps

After running the basic setup, you can:
1. Add MongoDB connection to the backend
2. Implement user authentication
3. Build the full UI components
4. Add job listings, profiles, marketplace features
