import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Registration failed');
            }

            // Redirect to login after successful registration
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-blue-500 bg-clip-text text-transparent">Create Account</h2>
                    <p className="text-gray-400 mt-2">Join the smart traffic community</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/50 text-white placeholder-gray-400"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800/50 text-white placeholder-gray-400"
                                placeholder="Valid password"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Role</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${formData.role === 'user' ? 'bg-[var(--primary)]/20 border border-[var(--primary)] text-[var(--primary)]' : 'bg-gray-800/50 border border-transparent text-gray-400'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <UserPlus size={18} />
                                <span>User</span>
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${formData.role === 'driver' ? 'bg-[var(--primary)]/20 border border-[var(--primary)] text-[var(--primary)]' : 'bg-gray-800/50 border border-transparent text-gray-400'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="driver"
                                    checked={formData.role === 'driver'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <Briefcase size={18} />
                                <span>Driver</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-3 rounded-xl font-bold text-lg mt-4 shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/40"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
