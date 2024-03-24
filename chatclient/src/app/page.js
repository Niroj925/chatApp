"use client"

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function ChatApp() {
  const [inputData, setInputData] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socketIo = io("http://localhost:3000");

    socketIo.on("message", function(data) {
      console.log(data)
      insertChat("you", data);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);


  const insertChat = (who, text) => {
    const newMessage = {
      who,
      text
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleMessage = (e) => {
    const text = e.target.value;
    if (e.key === 'Enter') {
      if (text.trim() !== "") {
        insertChat("me", text);
        const socketIo = io("http://localhost:3000");
        socketIo.emit("message", text);
        setInputData('');
      }
    }
   
    
  };

  return (
    <div className="container">
      <div className="chat-box">
        <ul className="messages">
          {messages.map((message, index) => (
            <li key={index} className={message.who === 'me' ? 'sent' : 'replies'}>
              <p>{message.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="input-box">
        <input
          className="mytext"
          placeholder="Type a message"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          onKeyDown={handleMessage}
        />
        <button className="send-btn" onClick={handleMessage}>Send</button>
      </div>
    </div>
  );
}
