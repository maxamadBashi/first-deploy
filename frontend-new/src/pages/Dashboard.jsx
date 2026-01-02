import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { LogOut, User as UserIcon, Settings as SettingsIcon, Bell, Search, LayoutGrid, ShieldCheck, Mail, ShoppingBag, Utensils, Layers, Users, Truck, Database, CreditCard, BarChart, Tag, MessageSquare, Info, Calendar } from 'lucide-react';
import Overview from '../components/admin/Overview';
import MenuManager from '../components/admin/MenuManager';
import CategoryManager from '../components/admin/CategoryManager';
import OrderManager from '../components/admin/OrderManager';
import TableManager from '../components/admin/TableManager';
import StaffManager from '../components/admin/StaffManager';
import InventoryManager from '../components/admin/InventoryManager';
import ReservationManager from '../components/admin/ReservationManager';
import CustomerManager from '../components/admin/CustomerManager';
import PaymentManager from '../components/admin/PaymentManager';
import ReviewManager from '../components/admin/ReviewManager';
import Settings from '../components/admin/Settings';
import CustomerDashboard from './CustomerDashboard';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get('/auth/profile');
                setUser(res.data);
                if (res.data.role !== 'admin' && res.data.role !== 'manager') {
                    // navigate('/login'); // Uncomment after testing or if you want strict enforcement
                }
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

    if (user.role === 'customer') {
        return <CustomerDashboard user={user} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 flex-col bg-white/90 backdrop-blur-xl border-r border-white/60 shadow-2xl shadow-indigo-100/30">
                <div className="p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-br-3xl">
                    <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <ShieldCheck size={28} className="drop-shadow-lg" />
                        </div>
                        <span className="text-xl font-black tracking-tight drop-shadow-lg">Karaama Admin</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {[
                        { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
                        { id: 'menu', icon: Utensils, label: 'Menu Management' },
                        { id: 'categories', icon: Layers, label: 'Categories' },
                        { id: 'orders', icon: ShoppingBag, label: 'Order Management' },
                        { id: 'reservations', icon: Calendar, label: 'Table Bookings' },
                        { id: 'customers', icon: Users, label: 'Customers' },
                        { id: 'staff', icon: ShieldCheck, label: 'Staff Management' },
                        { id: 'inventory', icon: Database, label: 'Inventory' },
                        { id: 'payments', icon: CreditCard, label: 'Finances' },
                        { id: 'reviews', icon: MessageSquare, label: 'Feedback' },
                        { id: 'settings', icon: SettingsIcon, label: 'System Settings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                                activeSection === item.id
                                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/40 transform scale-105'
                                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 hover:text-indigo-700 hover:shadow-lg hover:scale-105'
                            }`}
                        >
                            <item.icon size={20} className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200/60 bg-gradient-to-t from-slate-50/50 to-transparent">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:via-pink-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 hover:scale-105 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-white/60 shadow-lg shadow-indigo-100/20 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-10">
                    <div className="relative group max-w-md w-full hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl py-3 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-indigo-300 shadow-sm"
                        />
                    </div>
                    <div className="lg:hidden flex items-center gap-2">
                        <ShieldCheck size={28} className="text-indigo-600" />
                        <span className="font-bold text-slate-900">Karaama Admin</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl text-slate-600 hover:text-indigo-600 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 relative shadow-md hover:shadow-lg hover:scale-110 group">
                            <Bell size={20} className="group-hover:animate-pulse" />
                            <span className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full border-2 border-white shadow-lg animate-pulse"></span>
                        </button>
                        <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-1"></div>
                        <div className="flex items-center gap-3 pl-1">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 leading-none">{user.username}</p>
                                <p className="text-xs font-bold text-gradient mt-1 uppercase tracking-tighter">Premium Admin</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-indigo-500/40 hover:scale-110 transition-transform duration-300 pulse-glow">
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
                    {(() => {
                        switch (activeSection) {
                            case 'dashboard': return <Overview />;
                            case 'menu': return <MenuManager />;
                            case 'categories': return <CategoryManager />;
                            case 'orders': return <OrderManager />;
                            case 'tables': return <TableManager />;
                            case 'reservations': return <ReservationManager />;
                            case 'customers': return <CustomerManager />;
                            case 'staff': return <StaffManager />;
                            case 'inventory': return <InventoryManager />;
                            case 'payments': return <PaymentManager />;
                            case 'reviews': return <ReviewManager />;
                            case 'settings': return <Settings />;
                            default: return (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-200 border-dashed">
                                    <div className="p-6 bg-slate-50 rounded-3xl text-slate-400 mb-4">
                                        <Info size={48} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 capitalize">{activeSection.replace('-', ' ')}</h3>
                                    <p className="text-slate-500 font-medium">Qaybtan waa la dhisayaa dhawaan...</p>
                                </div>
                            );
                        }
                    })()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
