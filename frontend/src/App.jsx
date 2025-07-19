import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import UserSelector from "./components/UserSelector";
import ClaimButton from "./components/ClaimButton";
import Leaderboard from "./components/Leaderboard";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server");
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnectionStatus("disconnected");
    });

    socket.on("leaderboardUpdate", (updatedUsers) => {
      console.log("Received leaderboard update:", updatedUsers);
      setUsers(updatedUsers);
      setLastUpdate(new Date());

      if (selectedUser) {
        const updatedSelectedUser = updatedUsers.find(
          (u) => u._id === selectedUser._id
        );
        if (updatedSelectedUser) {
          setSelectedUser(updatedSelectedUser);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users`);
      setUsers(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) =>
      [...prevUsers, newUser].sort((a, b) => b.totalPoints - a.totalPoints)
    );
    setLastUpdate(new Date());
  };

  const handlePointsClaimed = (claimData) => {
    console.log("Points claimed:", claimData);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-600";
      case "disconnected":
        return "bg-red-600";
      default:
        return "bg-yellow-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-5 font-sans">
      <header className="text-center mb-8 pb-5 border-b-2 border-blue-600">
        <h1 className="text-blue-600 mb-2 text-4xl font-bold">
          🎮 Real-Time Leaderboard
        </h1>
        <p className="text-gray-600 text-base mb-3">
          Select a user and claim random points to see the leaderboard update in
          real-time!
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
          ></div>
          <span className="text-gray-600">
            {connectionStatus === "connected"
              ? "Connected"
              : connectionStatus === "disconnected"
              ? "Disconnected"
              : "Connecting..."}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <UserSelector
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          onUserAdded={handleUserAdded}
        />

        <ClaimButton
          selectedUser={selectedUser}
          onPointsClaimed={handlePointsClaimed}
        />
      </div>

      <Leaderboard users={users} lastUpdate={lastUpdate} />
    </div>
  );
};

export default App;
