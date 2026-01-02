import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import API from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50/50 via-pink-50/30 to-sky-50 px-4 py-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-sky-400/30 via-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/10 via-pink-300/10 to-indigo-300/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="max-w-md w-full glass-strong rounded-[2.5rem] p-10 relative transform transition-all duration-500 hover:scale-[1.02]">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl text-white shadow-2xl shadow-indigo-500/50 mb-6 group transition-all duration-300 hover:scale-110 hover:rotate-6 pulse-glow">
                        <LogIn size={36} className="drop-shadow-lg" />
                    </div>
                    <h1 className="text-4xl font-black text-gradient tracking-tight mb-2">Welcome Back!</h1>
                    <p className="mt-2 text-slate-600 font-medium">Please enter your details to sign in</p>
                </div>

                {error && (
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200/60 text-rose-700 px-5 py-4 rounded-2xl mb-6 text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-rose-100/50">
                        <span className="mt-0.5 text-rose-500 font-bold">⚠</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-2">
                            <Mail size={14} className="text-indigo-500" />
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all duration-300 group-focus-within:scale-110" size={20} />
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                className="input-field pl-14 pr-5"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end mb-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 flex items-center gap-2">
                                <Lock size={14} className="text-indigo-500" />
                                Password
                            </label>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all duration-300 group-focus-within:scale-110" size={20} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="input-field pl-14 pr-5"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary mt-4 flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Sign In
                                <LogIn className="transition-transform group-hover:translate-x-1" size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-200/60 pt-8">
                    <p className="text-slate-600 text-sm font-medium">
                        Don't have an account yet?{' '}
                        <Link to="/register" className="text-gradient font-bold decoration-2 underline-offset-4 hover:underline transition-all hover:scale-105 inline-block">
                            Create account →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
