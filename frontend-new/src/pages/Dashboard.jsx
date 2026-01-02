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
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200">
                <div className="p-8">
                    <div className="flex items-center gap-3 text-indigo-600">
                        <ShieldCheck size={32} />
                        <span className="text-xl font-black tracking-tight text-slate-900">Karaama Admin</span>
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
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${activeSection === item.id
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
                        <span className="font-bold text-slate-900">Karaama Admin</span>
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
