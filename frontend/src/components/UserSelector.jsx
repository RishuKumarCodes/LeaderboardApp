import React, { useState } from "react";
import axios from "axios";

const UserSelector = ({ users, selectedUser, onUserSelect, onUserAdded }) => {
  const [newUserName, setNewUserName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    setIsAdding(true);
    try {
      const response = await axios.post(`${backendUrl}/api/users`, {
        name: newUserName.trim(),
      });

      onUserAdded(response.data);
      setNewUserName("");
      alert(`User "${response.data.name}" added successfully!`);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to add user";
      alert(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="p-5 border border-gray-300 rounded-lg mb-5 bg-gray-100">
      <h3 className="text-xl font-semibold mb-4">Select User</h3>

      <div className="mb-4">
        <select
          value={selectedUser?._id || ""}
          onChange={(e) => {
            const user = safeUsers.find((u) => u._id === e.target.value);
            onUserSelect(user);
          }}
          className="p-2 text-base rounded border border-gray-300 w-52"
        >
          <option value="">-- Select a user --</option>
          {safeUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.totalPoints} points)
            </option>
          ))}
        </select>
      </div>

      {safeUsers.length === 0 && (
        <p className="text-gray-600 italic mb-4">
          No users available. Add a new user to get started!
        </p>
      )}

      <form
        onSubmit={handleAddUser}
        className="flex gap-3 items-center flex-wrap"
      >
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Enter new user name"
          disabled={isAdding}
          className="p-2 text-base rounded border border-gray-300 w-52 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isAdding || !newUserName.trim()}
          className={`px-4 py-2 text-base text-black rounded transition-opacity duration-200 ${
            isAdding || !newUserName.trim()
              ? "bg-blue-500 opacity-60 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isAdding ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default UserSelector;
