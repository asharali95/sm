// import { Server } from "socket.io";

// const SocketHandler = (req, res) => {
//   // console.log(res.socket.server)
//   if (res.socket.server.io) {
//     console.log("Socket is already running");
//   } else {
//     console.log("Socket is initializing");
//     const io = new Server(res.socket.server);
//     res.socket.server.io = io;

//     let chatRoom = ''; // E.g. javascript, node,...
//     let allUsers = []; // All users in current chat room
//     let chatRoomUsers = []
//     io.on('connection', (socket) => {
//       console.log(`User connected ${socket.id}`);

//       // Add a user to a room
//       socket.on('join_room', (data) => {
//         const { username, room } = data; // Data sent from client when join_room event emitted
//         socket.join(room); // Join the user to a socket room

//         let __createdtime__ = Date.now(); // Current timestamp
//         // Send message to all users currently in the room, apart from the user that just joined
//         console.log(`${username} has joined the chat room`);
//         // socket.to(room).emit('receive_message', {
//         //   message: `${username} has joined the chat room`,
//         //   username: CHAT_BOT,
//         //   __createdtime__,
//         // });
//         // // Send welcome msg to user that just joined chat only
//         // socket.emit('receive_message', {
//         //   message: `Welcome ${username}`,
//         //   username: CHAT_BOT,
//         //   __createdtime__,
//         // });
//         // Save the new user to the room
//         chatRoom = room;
//         allUsers.push({ id: socket.id, username, room });
//         chatRoomUsers = allUsers.filter((user) => user.room === room);
//         if(chatRoomUsers){
//           socket.to(room).emit('chatroom_users', chatRoomUsers);
//           socket.emit('chatroom_users', chatRoomUsers);
//         }
//       });

//       socket.on('send_message', (data) => {
//         const { message, username, room, __createdtime__ } = data;
//         io.in(room).emit('receive_message', data); // Send to all users in room, including sender

//       });

//       socket.on('leave_room', (data) => {
//         const { username, room } = data;
//         socket.leave(room);
//         const __createdtime__ = Date.now();
//         // Remove user from memory
//         allUsers = leaveRoom(socket.id, allUsers);
//         socket.to(room).emit('chatroom_users', allUsers);
//         // socket.to(room).emit('receive_message', {
//         //   username: CHAT_BOT,
//         //   message: `${username} has left the chat`,
//         //   __createdtime__,
//         // });
//         console.log(`${username} has left the chat`);
//       });

//       socket.on('disconnect', () => {
//         console.log('User disconnected from the chat');
//         const user = allUsers.find((user) => user.id == socket.id);
//         if (user?.username) {
//           allUsers = leaveRoom(socket.id, allUsers);
//           socket.to(chatRoom).emit('chatroom_users', allUsers);
//           socket.to(chatRoom).emit('receive_message', {
//             message: `${user.username} has disconnected from the chat.`,
//           });
//         }
//       });
//     });
//   }
//   // Add a user to a room

//   res.end();
// };

// export default SocketHandler;

import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  // console.log(res.socket.server)
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    let chatRoom = ""; // E.g. javascript, node,...
    let allUsers = []; // All users in current chat room

    io.on("connection", (socket) => {
      console.log(`User connected ${socket.id}`);

      // Add a user to a room
      socket.on("join_room", (data) => {
        const { room } = data; // Data sent from client when join_room event emitted
        socket.join(room); // Join the user to a socket room

        let __createdtime__ = Date.now(); // Current timestamp
        // Send message to all users currently in the room, apart from the user that just joined
        // console.log(`${username} has joined the chat room`);
        // socket.to(room).emit('receive_message', {
        //   message: `${username} has joined the chat room`,
        //   username: CHAT_BOT,
        //   __createdtime__,
        // });
        // // Send welcome msg to user that just joined chat only
        // socket.emit('receive_message', {
        //   message: `Welcome ${username}`,
        //   username: CHAT_BOT,
        //   __createdtime__,
        // });
        // Save the new user to the room
        chatRoom = room;
        allUsers.push({ id: socket.id, room });
        const chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit("chatroom_users", chatRoomUsers);
        socket.emit("chatroom_users", chatRoomUsers);
      });

      socket.on("send_message", (data) => {
        console.log(data);
        const { room,  } = data;
        io.in(room).emit("receive_message", data); // Send to all users in room, including sender
      });

      socket.on("leave_room", (data) => {
        const { room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        // Remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit("chatroom_users", allUsers);
        // socket.to(room).emit('receive_message', {
        //   username: CHAT_BOT,
        //   message: `${username} has left the chat`,
        //   __createdtime__,
        // });
        console.log(`${room} has left the chat`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected from the chat");
        const user = allUsers.find((user) => user.id == socket.id);
        if (user?.username) {
          allUsers = leaveRoom(socket.id, allUsers);
          socket.to(chatRoom).emit("chatroom_users", allUsers);
          socket.to(chatRoom).emit("receive_message", {
            message: `user has disconnected from the chat.`,
          });
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
