const TopThree = ({ users = [], onUserClick }) => {
  const getRankDisplay = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getProfileIcon = (index) => {
    const icons = ["👑", "🌟", "⭐"];
    return icons[index] || "👤";
  };

  const getCardHeight = (index) => {
    if (index === 0) return "h-88";
    if (index === 1) return "h-74";
    return "h-66";
  };

  if (users.length === 0) return null;

  return (
    <div className="flex justify-center items-end gap-4 max-w-4xl mx-auto">
      {users.map((user, index) => {
        const orderClass =
          index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3";
        const heightClass = getCardHeight(index);

        return (
          <div
            key={user._id || user.id || index}
            onClick={() => onUserClick(user)}
            className={`${orderClass} ${heightClass} w-[40%]`}
          >
            <div className="relative h-full bg-white rounded-t-3xl p-4 cursor-pointer flex flex-col justify-between text-center">
              <div className="text-3xl  p-1 absolute right-0 m-2">
                {getRankDisplay(index)}
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="text-5xl mt-10 aspect-square p-8 bg-amber-100 w-fit mx-auto rounded-full">
                  {getProfileIcon(index)}
                </div>
                <div className="font-semibold text-gray-800 mb-1 text-xl">
                  {user.name || "Unknown User"}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  🏆{user.totalPoints || 0}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopThree;
