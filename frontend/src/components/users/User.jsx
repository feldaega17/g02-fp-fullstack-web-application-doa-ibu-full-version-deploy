import { useSocketContext } from "../../context/SocketContext";
import useUsers from "../../zustand/useUsers";

const User = ({ user, lastIdx, emoji }) => {
  const { selectedUser, setSelectedUser } = useUsers();

  const isSelected = selectedUser?._id === user._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);

  const handleUserSelect = async () => {
    setSelectedUser(user);
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-28 py-1 cursor-pointer
                ${isSelected ? "bg-sky-500" : ""}`}
        onClick={handleUserSelect}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={user.profilePicture} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{user.fullname}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};
export default User;
