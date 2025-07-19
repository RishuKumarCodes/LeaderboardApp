# A full-stack real-time leaderboard app

![Leaderboard App Screenshot](frontend/src/assets/screenshot.png)

## Features

- **Real-time Updates**: Leaderboard updates instantly across all connected clients
- **User Management**: Add new users and select existing ones
- **Random Points**: Award 1-10 random points to any user
- **Persistent Data**: All user data and claim history stored in MongoDB
- **Responsive UI**: Clean, modern interface with real-time status indicators

## Tech Stack

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO for real-time communication
- CORS for cross-origin requests

### Frontend

- React with functional components and hooks
- Socket.IO client for real-time updates
- Axios for API calls
- Responsive CSS styling

## API Endpoints

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/users`           | Get all users sorted by total points |
| POST   | `/api/users`           | Add a new user                       |
| POST   | `/api/claim`           | Award random points to a user        |
| GET    | `/api/history/:userId` | Get claim history for a user         |
| GET    | `/health`              | Health check endpoint                |

## Socket.IO Events

- **leaderboardUpdate**: Emitted to all clients when points are claimed
- **connect/disconnect**: Connection status management

## Project Structure

```
leaderboard-app/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── ClaimHistory.js      # Claim history schema
│   ├── routes/
│   │   └── api.js               # API routes
│   ├── server.js                # Express server setup
│   ├── seed.js                  # Database seeding script
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserSelector.js  # User selection and addition
│   │   │   ├── ClaimButton.js   # Points claiming interface
│   │   │   └── Leaderboard.js   # Leaderboard display
│   │   ├── App.js               # Main app component
│   │   └── index.js             # React entry point
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

### Environment Variables (Backend)

- `MONGODB_URI`: `mongodb+srv://Rishu:fHYYFPdYwtMQeReT@cluster0.aj0r5ke.mongodb.net/`
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (default: development)

### Frontend Configuration

- Proxy configured to `http://localhost:5000` for API calls
- Socket.IO connects to `http://localhost:5000`
