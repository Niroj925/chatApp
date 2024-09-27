"use client";
import React, { useEffect, useState,useRef } from "react";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import api from "../component/api/api";

// const socket = io('http://localhost:3030/orders');
// const socket = io("http://localhost:3030/orders", {
//   query: {
//     room: "457fb9e1-c498-4007-8721-fc6dcb93877e",
//     table: "46d14258-4e0a-4514-a112-8b618ae37fc4",
//   },
// });

// http://localhost:3000/user?restaurant=457fb9e1-c498-4007-8721-fc6dcb93877e&table=46d14258-4e0a-4514-a112-8b618ae37fc4

function Page() {
  const searchParams = useSearchParams();
  const room = searchParams.get("restaurant") || '457fb9e1-c498-4007-8721-fc6dcb93877e';
  const table = searchParams.get("table") || '46d14258-4e0a-4514-a112-8b618ae37fc4';
  
  // Create a ref to hold the socket instance
  const socketRef = useRef(null);

  const orderBody = {
    phone: 986545124,
    table,
    remarks:'fast hai',
    orderInfo: [
      {
        product: "71fc070c-d680-413e-be56-6b129577ddee",
        quantity: 5,
        addOn: [
          { addOnId: "61c55c3c-6b52-43fa-8444-22aed9e10d95" },
          { addOnId: "9b5922dd-b214-4e5a-8022-e581d33b81e5" },
        ],
      },
      {
        product: "22b290d7-34fa-4eb0-97e6-f858887b7890",
        quantity: 5,
        addOn: [],
      },
    ],
  };

  const [order, setOrder] = useState(null);
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
  }, [room, table]);

  const orderNow = () => {
    if (socketRef.current) {
      socketRef.current.emit("createOrder", orderBody);
    }
  };

  return (
    <div>
      <h1>Room: {room}</h1>
      <h2>Table: {table}</h2>
      <button onClick={orderNow}>Order Now</button>
      {order && <div>Order: {JSON.stringify(order)}</div>}
    </div>
  );
}

export default Page;
