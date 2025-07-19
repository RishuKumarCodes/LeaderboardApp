import { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [newUserName, setNewUserName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleAddUser = async () => {
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

  return (
    <div className="rounded-lg mb-5 flex items-center flex-wrap">
      <input
        type="text"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        placeholder="Enter new user name"
        disabled={isAdding}
        className="p-2 px-4 text-base w-52 bg-white text-gray-800 rounded-full rounded-r-none disabled:opacity-60"
      />
      <div
        onClick={handleAddUser}
        className={`px-4 py-2 text-base text-white rounded-r-full cursor-pointer transition duration-200 ease-in-out
        ${
          isAdding || !newUserName.trim()
            ? "bg-blue-500 cursor-not-allowed pointer-events-none"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isAdding ? "Adding..." : "Add User"}
      </div>
    </div>
  );
};

export default AddUser;
