"use client";

import React, { useEffect, useState,useRef } from "react";
import io from "socket.io-client";

// const socket = io("http://localhost:3030/orders");

function page() {
  // const [room1, setRoom1] = useState("room1tu34653gsh3t7ge");
  // const [room2, setRoom2] = useState("room2tui8638ush3t7ge");
  const room ='457fb9e1-c498-4007-8721-fc6dcb93877e';
  const socketRef = useRef(null);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    // Initialize socket connection once
    socketRef.current = io("http://localhost:3030/orders", {
      query: {
        room: room
      },
    });

    // Handle successful connection
    socketRef.current.on("connect", () => {
      console.log("Connected to the socket server:", socketRef.current.id);
      // Optionally join a room (room emit can be moved here if needed)
      // socketRef.current.emit("join", room);
    });

    // Handle disconnection
    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected:", socketRef.current.id);
    });

    // Handle incoming order messages
    socketRef.current.on("order", (message) => {
      console.log("Received order:", message);
      setOrder(message);
    });

    socketRef.current.on("receiveOrder", (message) => {
      console.log("Received order:", message);
      setOrder(message);
    });

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        console.log("Disconnecting from socket:", socketRef.current.id);
        socketRef.current.disconnect();
      }
    };
  }, [room]);

  console.log(order);
  // useEffect(() => {
  //   socket.on("order", (message) => {
  //     console.log(message);
  //     setOrder([...order, message]);
  //   });
  //   socket.on("receiveOrder", (message) => {
  //     console.log(message);
  //     setOrder(message);
  //   });
  // }, []);

  // socket.on("connect", () => {
  //   console.log("Connected to the socket server");
  //   // Emit event to join a room
  //   // socket.emit("join", room);
  // });

  // // Handle disconnection
  // socket.on("disconnect", () => {
  //   console.log("Socket disconnected");
  // });

  // const joinRoom1 = () => {
  //   socket.emit("join", room1);
  // };

  // const joinRoom2 = () => {
  //   socket.emit("join", room2);
  // };

  return (
    <div>
      <h1>Restro page</h1>
      {/* <button onClick={joinRoom1}>Join room1</button> */}
      {/* <button onClick={joinRoom2}>Join room2</button> */}
    </div>
  );
}

export default page;
