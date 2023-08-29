'use client';

import React, { useState } from 'react';
import {AuthProvider} from './contexts/AuthContext'
import Form from './form'

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  return (
    <AuthProvider>
      <Form/>
    </AuthProvider>
  );
}
