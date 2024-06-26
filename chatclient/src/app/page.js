"use client" 

import React, { useState } from 'react';
import api from './component/api/api';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router=useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
  const data={
      email,
      password
    }
    try{
      const response=await api.post('http://localhost:4040/user/login',data);
      console.log(response.data);
      if(response.status===201){
        router.push(`/chat?id=${response.data.id}`);
      }

    }catch(err){
      console.log(err)
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Page;
