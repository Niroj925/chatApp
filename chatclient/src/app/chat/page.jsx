"use client"

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from './chat.module.css';
import { useSearchParams } from 'next/navigation';
import api from '../component/api/api';


const socket = io('http://localhost:4040/message');

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [isRoomExist,setIsRoomExist]=useState(false);
   
    const params = useSearchParams();
    const user1 = params.get('id');
    console.log(user1);

    const fetchAllUser = async () => {
        try {
            const response = await api.get('/user');
            console.log(response);
            if (response.status == 200) {
                setUsers(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAllUser();
    }, []);

    useEffect(() => {
        socket.on('message', (message) => {
          console.log(message);
            setMessages(prevMessages => [...prevMessages, message]);
        });
    }, []);


    const joinFrn = async (user2) => {
        setMessages([]);
        try{
            const response = await api.get(`/user/frn?user1=${user1}&user2=${user2}`);
            console.log(response);
            if(response.status===200){
                const room=response.data.id;
                setRoom(room);
                setIsRoomExist(true);
                console.log('room:',room);
                socket.emit('join', room); 
            }
        }catch(err){
            console.log('user not found');
        }
        
    }

    const handleSend = () => {
        if (inputMessage.trim() !== '') {
            const message = { room, text: inputMessage };
            socket.emit('createMessage', message);
            setInputMessage('');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.userBox}>
            {
                    users && users.map((usr, index) => {
                        return (
                            <>
                                {
                                    user1 !== usr.id && (
                                        <div key={index} className={styles.user} onClick={() => { joinFrn(usr.id) }}>
                                            <p>{usr.email}</p>
                                        </div>
                                    )
                                }
                            </>

                        )
                    })
                }
            </div>
            <div className={styles.messageBox}>
          {
            isRoomExist&&(
                <div className={styles.messageContainer}>
              <div className={styles.messsage}>
                {messages.map((msg, index) => (
                    <p key={index}>{msg.text}</p>
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
            )
          }
        </div>
        </div>
    );
};

export default ChatComponent;
