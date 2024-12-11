import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};
export default useListenMessages;

// import { useEffect } from "react";
// import { useSocketContext } from "../context/SocketContext";
// import useConversation from "../zustand/useConversation";
// import notificationSound from "../assets/sounds/notification.mp3";

// const useListenMessages = () => {
//   const { socket } = useSocketContext();
//   const { messages, setMessages } = useConversation();

//   useEffect(() => {
//     const handleNewMessage = (newMessage) => {
//       newMessage.shouldShake = true;
//       const sound = new Audio(notificationSound);
//       sound.play();
//       setMessages([...messages, newMessage]);
//     };

//     const handleMessagesSeen = (data) => {
//       const updatedMessagesMap = new Map(
//         data.map((msg) => [msg.id, { ...msg, read: true }])
//       );
//       setMessages((prevMessages) => {
//         const newMessages = prevMessages.map((msg) =>
//           updatedMessagesMap.has(msg.id)
//             ? { ...msg, ...updatedMessagesMap.get(msg.id) }
//             : msg
//         );
//         return newMessages;
//       });
//     };

//     const handleSocketEvent = (event, data) => {
//       if (event === "newMessage") {
//         handleNewMessage(data);
//       } else if (event === "messagesSeen") {
//         handleMessagesSeen(data);
//       }
//     };

//     socket?.on("event", handleSocketEvent);

//     return () => {
//       socket?.off("event", handleSocketEvent);
//     };
//   }, [socket, setMessages, messages]);

//   return null;
// };

// export default useListenMessages;
