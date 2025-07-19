import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import Leaderboard from "./components/Leaderboard.jsx";
import ClaimPopup from "./components/ClaimPopup.jsx";
import AddUser from "./components/AddUser.jsx";
import bgImage from "./assets/bg.jpeg";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  const [popupUser, setPopupUser] = useState(null);
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
    }
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

  const handleUserClick = (user) => {
    setPopupUser(user);
    setShowClaimPopup(true);
  };

  const handleClosePopup = () => {
    setShowClaimPopup(false);
    setPopupUser(null);
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

  return (
    <div
      className="w-[100vw] h-screen bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-screen-xl mx-auto p-5 font-sans">
        <header className="text-center mb-8 pb-5 ">
          <h1 className="text-black mb-2 text-4xl font-black">
            Real-Time Leaderboard
          </h1>
          <p className="text-gray-600 text-base mb-3">
            Select a user and claim random points to see the leaderboard update
            in real-time!
          </p>
        </header>

        <div className="flex items-center justify-between">
          <AddUser users={users} onUserAdded={handleUserAdded} />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/70 text-sm backdrop-blur-2xl">
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
        </div>
        <Leaderboard
          users={users}
          lastUpdate={lastUpdate}
          onUserClick={handleUserClick}
        />

        {showClaimPopup && (
          <ClaimPopup
            user={popupUser}
            onClose={handleClosePopup}
            onPointsClaimed={handlePointsClaimed}
          />
        )}
      </div>
    </div>
  );
};

export default App;
