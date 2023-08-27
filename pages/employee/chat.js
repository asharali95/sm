// import styles from './styles.module.css';
// import RoomAndUsersColumn from "./room-and-users";
// import SendMessage from "./send-message";
// import MessagesReceived from "./messages";
// import styles from "./styles.module.css";
import { useState, useEffect, useRef, Fragment } from "react";
import { io } from "socket.io-client";
// import { useNavigate } from "react-router-dom";
const Chat = ({ username, room }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket')
    let sock = io()
    setSocket(sock)
  }

  return (
    <Fragment>
    {socket ? <div>
    
    <RoomAndUsers socket={socket} username={username} room={room} />

    <div>
      <Messages socket={socket} />
      <SendMessage socket={socket} username={username} room={room} />
    </div>
  </div>: <>wait...</>}
    </Fragment>
    
  );
};

export default Chat;

//

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  //   const navigate = useNavigate();

  useEffect(() => {
    socket.on("chatroom_users", (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off("chatroom_users");
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    // Redirect to home page
    // navigate("/", { replace: true });
  };

  return (
    <div>
      <h2>{room}</h2>

      <div>
        {roomUsers.length > 0 && <h5>Users:</h5>}
        <ul>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? "bold" : "normal"}`,
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button className="btn btn-outline" onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  const messagesColumnRef = useRef(null);

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  // Scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{msg.username}</span>
            <span>{formatDateFromTimestamp(msg.__createdtime__)}</span>
          </div>
          <p>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit("send_message", { username, room, message, __createdtime__ });
      setMessage("");
    }
  };

  return (
    <div>
      <input
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};
