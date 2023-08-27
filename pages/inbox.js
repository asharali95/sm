import { format } from "date-fns";
import { useRouter } from "next/router";
import axios from "axios";
import { signOut } from "next-auth/react";
import {
  PaperClipIcon,
  XMarkIcon,
  ArrowUturnRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";

import io from "socket.io-client";
let socket;
import { Fragment, useEffect, useRef, useState } from "react";
import { cloudinaryUploader } from "../utils/cloudinaryUploader";
const ConversationListItem = ({
  employeeId,
  employerId,
  userInfo,
  setconvo,
}) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "employee") {
        setData(employerId);
      } else {
        setData(employeeId);
      }
    }
  }, [userInfo]);
  // const formattedTimestamp = format(new Date(timestamp), "HH:mm");

  return (
    <div
      className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
      onClick={setconvo}
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 mr-4"></div>
      <div className="flex-1">
        <h3 className="font-semibold">{data?.name}</h3>
        {/* <p className="text-sm text-gray-500">{lastMessage}</p> */}
      </div>
      {/* <p className="text-sm text-gray-500">{formattedTimestamp}</p> */}
    </div>
  );
};

const Sidebar = ({ conversations, selectConvo, userInfo }) => {
  return (
    <div className="w-full md:w-1/4 bg-white border-r border-gray-300 overflow-y-auto">
      {conversations?.length?conversations.map((conversation, index) => (
        <ConversationListItem
          key={index}
          userInfo={userInfo}
          {...conversation}
          setconvo={() => selectConvo(conversation._id)}
        />
      )): <p className="p-4 text-center">No inbox yet.</p>}
    </div>
  );
};

const Message = ({
  message,
  sender,
  showReply,
  attachment,
  isShowReply,
  _id,
  setReplyId,
  replyId,
  createdAt,
  allMessages,
}) => {
  // const formattedTimestamp = format(new Date(timestamp), "HH:mm");
  return (
    <div className={`mb-2 ${sender === "user" ? "text-right" : ""}`}>
      <div
        onMouseLeave={() => {
          showReply(false, _id);
        }}
        className={`flex items-end ${sender === "user" ? "justify-end" : ""}`}
      >
        {isShowReply.show && isShowReply.id === _id && (
          <ArrowUturnRightIcon
            className="w-6 h-6"
            style={{
              paddingRight: "5px",
              paddingBottom: "5px",
              cursor: "pointer",
            }}
            onClick={() => setReplyId(_id)}
          />
        )}
        {replyId ? (
          <div>
            <p
              style={{
                background: "#e1e1e1",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            > {allMessages?.find((itm) => itm._id === replyId)?.attachment?<a href={allMessages?.find((itm) => itm._id === replyId)?.message} target="_blank" rel="noopener noreferrer">
            <i>Click to view attachment</i>
          </a>:allMessages?.find((itm) => itm._id === replyId)?.message}
              {/* {attachment ? allMessages?.find((itm) => itm._id === replyId)?.message} */}
            </p>
            <div
              className={`p-2 rounded-lg ${
                sender === "user"
                  ? "bg-green-500 text-white"
                  : "bg-white border border-gray-300"
              }`}
              style={{ minWidth: "100px" }}
              onMouseEnter={() => {
                showReply(true, _id);
              }}
            >
             {attachment?<a href={message} target="_blank" rel="noopener noreferrer">
          <i>Click to view attachment</i>
        </a>:message}
            </div>
          </div>
        ) : (
          <div
            className={`p-2 rounded-lg ${
              sender === "user"
                ? "bg-green-500 text-white"
                : "bg-white border border-gray-300"
            }`}
            onMouseEnter={() => {
              showReply(true, _id);
            }}
          >
           {attachment?<a href={message} target="_blank" rel="noopener noreferrer">
          <i>Click to view attachment</i>
        </a>:message}
          </div>
        )}

        {/* <div
          className={`p-2 rounded-lg ${
            sender === "user"
              ? "bg-green-500 text-white"
              : "bg-white border border-gray-300"
          }`}
          onMouseEnter={() => {
            showReply(true, _id);
          }}
        >
          {message}
        </div> */}
      </div>
      <p
        className={`text-xs text-gray-500 mt-1 ${
          sender === "user" ? "text-right" : ""
        }`}
      >
        {format(new Date(createdAt), "HH:mm")}
      </p>
    </div>
  );
};

const ChatConversation = ({
  messages,
  socket,
  selectedConvo,
  setReplyId,
  replyId,
  userInfo,
  chat,
  isShowReply,
  showReply,
  conversations,
}) => {
  const [attach, setAttach] = useState(null);
  const [msg, setmsg] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState('');
  const fileInputRef = useRef();
  const [fileName, setFileName] = useState('');
  const chatRef = useRef();
  const sendMessage = async (message, attachment = false) => {
    let data = {
      chatId: selectedConvo,
      senderId: userInfo?.id,
      message,
      attachment,
      replyId,
    };
    try {
      if(attachment){
        const uploadRes = await cloudinaryUploader.uploadAttachment(
          fileDataUrl,
          fileName
        );
        data.message = uploadRes?.url
        data.attachment = true
      }
      const res = await axios.post(
        "/api/private/conversation/saveConversation",
        data
      );
      if (res.status === 200) {
        socket.emit("send_message", {
          room: selectedConvo,
          message,
          ...res.data.data,
          senderId: userInfo?.id,
        });
        setFileDataUrl('')
        setFileName('')
        setReplyId(null)
      }
    } catch (error) {
      alert(error)
    }

  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      let div = chatRef.current;
      div.scrollTop = div.scrollHeight;
    }
  }, [messages]);

  // useEffect(()=>{
  //   if(selectedConvo){
  //     // fetchConversation(selectedConvo)
  //   }
  // },[selectedConvo])
  const handleAllow = async (e) => {
    let data = {
      chatId: selectedConvo,
      allowed: e.target.checked,
    };
    try {
      const res = await axios.put("/api/private/chat/updateChat", data);
      if (res.data) {
      }
    } catch (error) {}

    // alert(e.target.checked)
  };
  const handleFile = (e) =>{
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setFileName(file.name); // Save the file name for preview
      setFileDataUrl(file); // Set the base64 data URL
    //   const reader = new FileReader();

    //   reader.onload = (e) => {
    //     const base64Data = e.target.result.split(',')[1];
    //     setFileDataUrl(base64Data); // Set the base64 data URL
    //   };

    //   reader.readAsDataURL(file); // Read the file as data URL
    }
  }
  return (
    <>
      {selectedConvo ? (
        <Fragment>
          <div
            className={`p-4 bg-white shadow-md ${
              userInfo?.role === "employer" && "flex justify-between"
            }`}
          >
            <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>
              {userInfo?.role === "employee"
                ? chat?.employerId?.name
                : chat?.employeeId?.name}
            </h1>
            {userInfo?.role === "employer" && (
              <div className="flex ">
                <input
                  type="checkbox"
                  defaultChecked={chat?.allowed}
                  onChange={handleAllow}
                />
                <p className="mx-2">Allow chat</p>
              </div>
            )}
          </div>

          <div ref={chatRef} className="flex-1 bg-gray-100 overflow-y-auto p-4">
            <div className="flex-1 overflow-y-auto">
              {messages?.map((message, index) => (
                <Message
                  allMessages={messages}
                  key={index}
                  setReplyId={setReplyId}
                  isShowReply={isShowReply}
                  showReply={(show, id) => {
                    showReply(show, id);
                  }}
                  {...message}
                />
              ))}
            </div>
          </div>
          {chat?.allowed ? (
            <Fragment>
              <Fragment>
                {replyId && (
                  <div className="p-4 w[100%] bg-white shadow-md flex justify-between">
                    <p>
                    {messages?.find((itm) => itm._id === replyId).attachment?<a href={messages?.find((itm) => itm._id === replyId).message} target="_blank" rel="noopener noreferrer">
          <i>Click to view attachment</i>
        </a>:messages?.find((itm) => itm._id === replyId).message}
                    
                      {/* {} */}
                    </p>
                    {/* <p>X</p> */}
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => setReplyId(null)}
                    />
                  </div>
                )}
                {fileDataUrl && (
                  <div className="p-4 w[100%] bg-white shadow-md flex justify-between">
                    <p>
                     {fileName}
                    </p>
                    {/* <p>X</p> */}
                    <XMarkIcon
                      className="w-4 h-4"
                      onClick={() => {    fileInputRef.current.value = '';
                      ;setFileDataUrl(""); setFileName("")}}
                    />
                  </div>
                )}
              </Fragment>
              <div className="p-4 bg-white shadow-md">
                <div className="flex items-center">
                  <label htmlFor="attach">
                    <PaperClipIcon className="w-6 h-6" />
                  </label>
                  <input
                    type="file"
                    id="attach"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleFile(e)}
                  />
                  <input
                    type="text"
                    // disabled={fileDataUrl}
                    placeholder="Type your message..."
                    className="flex-1 p-2 outline-none"
                    value={msg}
                    onChange={(e) => {
                      if(fileDataUrl){
                        setmsg("")
                      }
                      else{
                        setmsg(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if(fileDataUrl){
                          sendMessage(fileDataUrl, true );
                        }else{
                          if(e.target.value){
                            sendMessage(e.target.value );

                          }
                        }
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    // disabled={!msg.length}
                    onClick={() => {
                      if(fileDataUrl){
                        // alert("main inside")
                        sendMessage(fileDataUrl, true );
                      }else{
                        if(msg){
                          sendMessage(msg );

                        }
                      }
                    }}
                    className="text-blue-500"
                  >
                    <ChevronDoubleRightIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </Fragment>
          ) : (
            <p className="p-4 bg-white shadow-md text-center">
              {"Unable to send message since it's not allowed"}
            </p>
          )}
        </Fragment>
      ) : (
        <>
          <p>Inbox</p>
          <div className="p-4 bg-white shadow-md">
            <div className="flex items-center">
              <button className="text-blue-500">
                <PaperClipIcon className="w-6 h-6" />
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button className="text-blue-500">
                <ChevronDoubleRightIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const Inbox = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { query } = router;
  const [socket, setSocket] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [replyId, setReplyId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isShowReply, showReply] = useState({ show: false, id: null });
  const fetchConversations = async (id, role) => {
    try {
      let res = await axios.get("/api/private/chat", {
        params: {
          id,
          role,
        },
      });
      if (res.data) {
        setConversations(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if(session){
      const sessionDuration =
      new Date(session?.expires).getTime() - new Date().getTime();

    const timeout = setTimeout(() => {
      if (new Date(session?.expires) < Date.now()) {
        signOut();
      }

    }, sessionDuration)
    if (session.user.email) {
      setUserInfo(session);
      fetchConversations(session.id, session.role);
    }
    return () => clearTimeout(timeout);

    }
   
  }, [session]);

  // useEffect(() => {
  //   if ((query.conversationId && conversations.length && socket, session)) {
  //     setSelectedConvo(
  //       conversations.find((itm) => itm._id === query.conversationId)
  //     );
  //     socket.emit("join_room", { username: session.user.email, room });
  //   }
  // }, [query, conversations, socket, session]);

  useEffect(() => {
    if (userInfo) {
      socketInitializer();
    }
  }, [userInfo]);

  useEffect(() => {
    if (selectedConvo) {
      fetchConversation(selectedConvo);
    }
  }, [selectedConvo]);

  const fetchConversation = async (chatId) => {
    let res = await axios.get("/api/private/conversation", {
      params: {
        chatId,
      },
    });
    if (res.data) {
      console.log(res.data.data);
      setMessages(
        res.data.data.map((itm) => ({
          ...itm,
          sender: itm.senderId === session?.id ? "user" : "agent",
        }))
      );
    }
  };

  const socketInitializer = async () => {
    await fetch("/api/socket");
    let sock = io({ transports: ['websocket']})

    sock.on("receive_message", (data) => {
      setMessages((state) => [
        ...state,
        {
          ...data,
          message: data.message,
          // timestamp: Date.now(),
          sender: data.senderId === session?.id ? "user" : "agent",
        },
      ]);
      // setSelectedConvo((state) => ({
      //   ...state,
      //   messages: [
      //     ...state.messages,
      //     {
      //       text: data.message,
      //       timestamp: Date.now(),
      //       sender: data.username===session?.user?.email?"user":"agent",
      //     },
      //   ],
      // }));
    });
    setSocket(sock);
  };

  const joinRoom = (room) => {
    if (room !== "") {
      socket.emit("join_room", { senderId: session.id, room });
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-md h-screen">
      <Sidebar
        conversations={conversations}
        userInfo={userInfo}
        selectConvo={(convoId) => {
          joinRoom(convoId);
          setSelectedConvo(
            conversations?.find((itm) => itm._id === convoId)._id
          );
        }}
      />
      <div className="flex flex-col h-screen w-screen bg-gray-100">
        {selectedConvo && (
          <ChatConversation
            messages={messages}
            conversations={conversations}
            setReplyId={setReplyId}
            replyId={replyId}
            chat={conversations?.find((itm) => itm._id === selectedConvo)}
            isShowReply={isShowReply}
            userInfo={userInfo}
            showReply={(show, id) => showReply({ show, id })}
            selectedConvo={selectedConvo}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
};

export default Inbox;
