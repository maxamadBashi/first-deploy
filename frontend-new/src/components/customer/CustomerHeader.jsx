import React from 'react';
import { Search, Bell, User, ShoppingBag } from 'lucide-react';

const CustomerHeader = ({ user, cartCount, activeSection, setActiveSection }) => {
    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div className="flex flex-col cursor-pointer" onClick={() => setActiveSection('menu')}>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Karaama</h1>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Open now</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-6">
                    {[
                        { id: 'menu', label: 'Cuntada' },
                        { id: 'orders', label: 'Dalabyadayda' },
                        { id: 'reservations', label: 'Qabso Miis' }
                    ].map(link => (
                        <button
                            key={link.id}
                            onClick={() => setActiveSection(link.id)}
                            className={`text-sm font-black uppercase tracking-widest transition-all ${activeSection === link.id ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 max-w-sm mx-8 hidden xl:block">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search food..."
                        className="w-full bg-slate-100/50 border-none rounded-2xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-slate-400 font-medium text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-xs font-black text-slate-900 leading-none">Account</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-1">{user?.username || 'Guest'}</span>
                </div>
                <button
                    onClick={() => setActiveSection('profile')}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${activeSection === 'profile' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                >
                    <User size={20} />
                </button>
                <button className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all relative">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-orange-600 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-orange-500">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};

export default CustomerHeader;
