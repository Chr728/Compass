import React, {useState} from 'react';
import {useAuth} from '@/app/contexts/AuthContext';

const Form = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {login} = useAuth()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
           await login(email, password)
            console.log('Login successful');
            // Handle any necessary navigation or state changes upon successful login
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form
                onSubmit={handleSubmit}
                className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-4">Login</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Login
                    </button>
                </div>
            </form>
        </main>
    );
};

export default Form;