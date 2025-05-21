'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (email: string, password: string) => void;
  type: 'login' | 'register';
};

export default function AuthForm({ onSubmit, type }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">{type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h1>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {type === 'login' ? 'Entrar' : 'Registrarse'}
      </button>
    </form>
  );
}
