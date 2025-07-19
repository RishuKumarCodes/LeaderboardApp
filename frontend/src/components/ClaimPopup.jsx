import React, { useState } from "react";
import axios from "axios";

const ClaimPopup = ({ user, onClose, onPointsClaimed }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleClaim = async () => {
    if (!user) return;

    setIsClaiming(true);
    try {
      const response = await axios.post(`${backendUrl}/api/claim`, {
        userId: user._id,
      });
      const { pointsAwarded, newTotal } = response.data;
      onPointsClaimed({
        user: user,
        pointsAwarded,
        newTotal,
      });

      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to claim points";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Award Points</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            disabled={isClaiming}
          >
            ×
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl mb-3 bg-gray-300 mx-auto w-fit rounded-full aspect-square p-3">
            👤
          </div>
          <h4 className="text-lg font-bold mb-2">{user.name}</h4>
          <p className="text-gray-600">
            Current Points:{" "}
            <span className="font-semibold text-green-600">
              {user.totalPoints}
            </span>
          </p>
        </div>

        <div className="flex gap-3 ">
          <div
            onClick={onClose}
            disabled={isClaiming}
            className="flex-1 px-4 py-2 text-center text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </div>
          <div
            onClick={handleClaim}
            disabled={isClaiming}
            className="flex-1 px-4 py-2 text-center bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isClaiming ? "Awarding..." : "🎲 Award Points"}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          Click to award 1-10 random points to {user.name}
        </p>
      </div>
    </div>
  );
};

export default ClaimPopup;
