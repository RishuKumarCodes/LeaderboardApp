import React from "react";

const Leaderboard = ({ users = [], lastUpdate }) => {
  const safeUsers = Array.isArray(users) ? users : [];

  const getRankDisplay = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-semibold m-0">🏆 Leaderboard</h3>
        {lastUpdate && (
          <span className="text-xs text-gray-600 italic">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        )}
      </div>

      {safeUsers.length === 0 ? (
        <p className="text-center text-gray-600 italic">
          No users found. Add some users to get started!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-3 text-left border-b-2 border-blue-800">
                  Rank
                </th>
                <th className="px-4 py-3 text-left border-b-2 border-blue-800">
                  Name
                </th>
                <th className="px-4 py-3 text-right border-b-2 border-blue-800">
                  Total Points
                </th>
              </tr>
            </thead>
            <tbody>
              {safeUsers.map((user, index) => (
                <tr
                  key={user._id || user.id || index}
                  className={`transition-colors duration-300 hover:bg-blue-100 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-lg">
                    {getRankDisplay(index)}
                  </td>
                  <td className="px-4 py-3 text-base">
                    {user.name || "Unknown User"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right text-base font-bold ${
                      (user.totalPoints || 0) > 0
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {user.totalPoints || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-600">
        <strong>Total Users:</strong> {safeUsers.length} |{" "}
        <strong>Total Points Awarded:</strong>{" "}
        {safeUsers.reduce((sum, user) => sum + (user.totalPoints || 0), 0)}
      </div>
    </div>
  );
};

export default Leaderboard;
