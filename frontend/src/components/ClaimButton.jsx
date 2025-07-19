import React, { useState } from "react";
import axios from "axios";

const ClaimButton = ({ selectedUser, onPointsClaimed }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleClaim = async () => {
    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    setIsClaiming(true);
    try {
      const response = await axios.post(`${backendUrl}/api/claim`, {
        userId: selectedUser._id,
      });
      const { pointsAwarded, newTotal } = response.data;

      alert(
        `🎉 You awarded ${pointsAwarded} points to ${selectedUser.name}! New total: ${newTotal}`
      );

      onPointsClaimed({
        user: selectedUser,
        pointsAwarded,
        newTotal,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to claim points";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg mb-5 bg-blue-50 text-center">
      <h3 className="text-xl font-semibold mb-3">Claim Points</h3>

      {selectedUser ? (
        <div className="mb-4">
          <p className="text-base mb-1">
            Selected: <strong>{selectedUser.name}</strong> (
            {selectedUser.totalPoints} points)
          </p>
        </div>
      ) : (
        <p className="text-gray-600 mb-4">
          Please select a user to claim points
        </p>
      )}

      <button
        onClick={handleClaim}
        disabled={!selectedUser || isClaiming}
        className={`px-6 py-3 text-lg font-bold rounded-md text-black transition-colors duration-200 ${
          selectedUser && !isClaiming
            ? "bg-green-600 hover:bg-green-700 cursor-pointer"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        {isClaiming ? "Claiming..." : "🎲 Claim Random Points (1-10)"}
      </button>

      <p className="text-sm text-gray-600 mt-3 italic">
        Click to award 1-10 random points to the selected user
      </p>
    </div>
  );
};

export default ClaimButton;
