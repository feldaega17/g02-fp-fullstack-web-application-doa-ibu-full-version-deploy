import { useEffect, useState } from "react";
import useUsers from "../../zustand/useUsers";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import Conversation from "../sidebar/Conversation";
import useConversation from "../../zustand/useConversation";

const UserContainer = () => {
  const { selectedUser, setSelectedUser } = useUsers();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Cleanup function (unmounts)
    return () => setSelectedUser(null);
  }, [setSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      // Fetch and show password
      fetchPassword(selectedUser._id).then((password) => {
        toast.info(`Password: ${password}`);
      });
    }
  }, [selectedUser, setConversations]);

  const fetchPassword = async (userId) => {
    // Replace with your API call to fetch the password
    const response = await fetch(`/users/password/${userId}`);
    const data = await response.json();
    return data.password;
  };

  return (
    <div className="md:min-w-[450px] lg:w-full flex flex-col">
      {!selectedUser ? (
        <NoUserSelected authUser={authUser} />
      ) : (
        <>
          {/* Header */}
          <div className="bg-green-700 px-4 py-2 mb-2">
            <span className="text-gray-900 font-bold">
              {selectedUser.fullName}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserContainer;

const NoUserSelected = ({ authUser }) => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
      <p>Welcome 👋 {authUser.fullName} ❄</p>
      <p>Select a user to view their conversations</p>
      <TiMessages className="text-3xl md:text-6xl text-center" />
    </div>
  </div>
);
