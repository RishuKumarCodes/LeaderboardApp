import TopThree from "./TopThree";

const Leaderboard = ({ users = [], lastUpdate, onUserClick }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const topThreeUsers = safeUsers.slice(0, 3);
  const remaining = safeUsers.slice(3);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        {lastUpdate && (
          <span
            className="text-xs text-white italic ml-auto"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.75)" }}
          >
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        )}
      </div>

      {safeUsers.length === 0 ? (
        <p className="text-center text-gray-600 italic">
          No users found. Add some users to get started!
        </p>
      ) : (
        <>
          {/* now just render TopThree */}
          <TopThree users={topThreeUsers} onUserClick={onUserClick} />

          {/* remaining users table */}
          {remaining.length > 0 && (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white text-black">
                    <th className="px-4 py-3 text-left border-b-1 border-gray-300">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left border-b-1 border-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-3 text-right border-b-1 border-gray-300">
                      Total Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {remaining.map((user, idx) => {
                    const rank = idx + 4; // since slice(3) starts at 4th
                    return (
                      <tr
                        key={user._id || user.id || rank}
                        onClick={() => onUserClick(user)}
                        className={`transition-colors duration-300 hover:bg-blue-100 cursor-pointer ${
                          idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-lg">#{rank}</td>
                        <td className="px-4 py-3 text-base">{user.name}</td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div className="mt-4 p-3 bg-gray-100/80 rounded-2xl text-sm text-gray-600 backdrop-blur-3xl">
        <strong>Total Users:</strong> {safeUsers.length} |{" "}
        <strong>Total Points Awarded:</strong>{" "}
        {safeUsers.reduce((sum, u) => sum + (u.totalPoints || 0), 0)}
      </div>
    </div>
  );
};

export default Leaderboard;
