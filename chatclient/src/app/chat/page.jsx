"use client";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styles from "./chat.module.css";
import { useSearchParams } from "next/navigation";
import api from "../component/api/api";

const socket = io("http://localhost:4040/message");

const ChatComponent = () => {
  const [messages, setMessages] = useState([]); 
  const [inputMessage, setInputMessage] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [isRoomExist, setIsRoomExist] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const activeUserRef = useRef(activeUser);

  const params = useSearchParams();
  const user1 = params.get("id");

  console.log('au:',activeUser)

  const fetchAllUser = async () => {
    try {
      const response = await api.get("/user");
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    activeUserRef.current = activeUser;
  }, [activeUser]); 
  

  useEffect(() => {
    fetchAllUser();
  }, []);

  useEffect(() => {
    const messageListener = (message) => {
        if (message.sender === activeUserRef.current) {
          setMessages((prev) => [...prev, message.message]);  
        }
      };

    const receiveMessageListener = (message) => {
      let msgList = message.map((msg) => msg.message);
      setMessages(msgList);  
    };

    socket.on("message", messageListener);
    socket.on("receiveMessage", receiveMessageListener);

    return () => {
      socket.off("message", messageListener);
      socket.off("receiveMessage", receiveMessageListener);
    };
  }, []);

  const joinFrn = async (user2) => {
    setActiveUser(user2);
    setMessages([]);  
    try {
      const response = await api.get(`/user/frn?user1=${user1}&user2=${user2}`);
      if (response.status === 200) {
        const room = response.data.id;
        setRoom(room);
        setIsRoomExist(true);
        socket.emit("join", room);
      }
    } catch (err) {
      setRoom(null);
      console.error("User not found:", err);
    }
  };

  const handleSend = () => {
    if (inputMessage.trim() !== "") {
      const message = { sender: user1, message: inputMessage, room };
      socket.emit("createMessage", message);
      setMessages((prev) => [...prev, inputMessage]);  
      setInputMessage("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.userBox}>
        {users &&
          users.map((usr, index) => (
            user1 !== usr.id && (
              <div
                key={index}
                className={styles.user}
                style={{ backgroundColor: usr.id === activeUser ? "#dad4d4" : "#9eafb9" }}
                onClick={() => joinFrn(usr.id)}
              >
                <p>{usr.email}</p>
                <p style={{fontSize:'10px'}}>{usr.id}</p>
              </div>
            )
          ))}
      </div>
      <div className={styles.messageBox}>
        {isRoomExist && (
          <div className={styles.messageContainer}>
            <div className={styles.messsage}>
              {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
            <div className={styles.inputMsg}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
