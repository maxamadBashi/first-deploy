import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { LogOut, User as UserIcon, Settings, Bell, Search, LayoutGrid, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get('/auth/profile');
                setUser(res.data);
            } catch (err) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium text-slate-500 animate-pulse">Initializing your experience...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200">
                <div className="p-8">
                    <div className="flex items-center gap-3 text-indigo-600">
                        <ShieldCheck size={32} />
                        <span className="text-xl font-black tracking-tight text-slate-900">SecureApp</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {[
                        { icon: LayoutGrid, label: 'Dashboard', active: true },
                        { icon: UserIcon, label: 'Profile Settings', active: false },
                        { icon: Bell, label: 'Notifications', active: false },
                        { icon: Settings, label: 'Security', active: false },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${item.active
                                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 font-bold hover:bg-rose-50 transition-colors group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-10">
                    <div className="relative group max-w-md w-full hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="lg:hidden flex items-center gap-2">
                        <ShieldCheck size={28} className="text-indigo-600" />
                        <span className="font-bold text-slate-900">SecureApp</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-3 pl-1">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
                                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-tighter">Gold Tier Member</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <button onClick={handleLogout} className="lg:hidden p-2.5 bg-rose-50 rounded-xl text-rose-600">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
                        <p className="text-slate-500 font-medium mt-1">Check your latest security status and activity logs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: 'Account Status', value: 'Active', color: 'bg-emerald-50 text-emerald-600' },
                            { label: 'Security Level', value: 'High', color: 'bg-indigo-50 text-indigo-600' },
                            { label: 'Last Login', value: 'Just now', color: 'bg-sky-50 text-sky-600' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.color}`}>Verified</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-black text-slate-900 text-lg">My Information</h3>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">Download Logs</button>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Display Name</p>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <UserIcon className="text-indigo-500" size={20} />
                                        <span className="font-bold text-slate-800">{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Identity</p>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Mail className="text-indigo-500" size={20} />
                                        <span className="font-bold text-slate-800">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <ShieldCheck size={40} className="mb-4 text-indigo-200" />
                                        <h4 className="text-xl font-bold mb-2">Security Shield Active</h4>
                                        <p className="text-indigo-100 text-sm leading-relaxed">
                                            Your account is protected by industry-standard JWT encryption and bcrypt hashing algorithms.
                                        </p>
                                    </div>
                                    <button className="mt-8 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl font-bold transition-all text-sm self-start">
                                        Enhance Security
                                    </button>
                                </div>
                                {/* Decorative circles */}
                                <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
