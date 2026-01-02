import React from 'react';
import { Search, Bell, User, ShoppingBag } from 'lucide-react';

const CustomerHeader = ({ user, cartCount, activeSection, setActiveSection }) => {
    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-white/20 px-6 py-4 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-10">
                <div
                    className="flex flex-col cursor-pointer group"
                    onClick={() => setActiveSection('menu')}
                >
                    <h1 className="text-3xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent tracking-tighter group-hover:scale-105 transition-transform duration-300">
                        Karaama
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Open Now</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-1">
                    {[
                        { id: 'menu', label: 'Cuntada' },
                        { id: 'orders', label: 'Dalaba' },
                        { id: 'reservations', label: 'Booska' }
                    ].map(link => (
                        <button
                            key={link.id}
                            onClick={() => setActiveSection(link.id)}
                            className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${activeSection === link.id
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 max-w-sm mx-12 hidden xl:block">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors duration-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search for delicious food..."
                        className="w-full bg-slate-100/50 border-2 border-transparent rounded-[1.25rem] py-2.5 pl-11 pr-4 focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all duration-300 placeholder:text-slate-400 font-bold text-xs"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Welcome</span>
                    <span className="text-xs font-black text-slate-900 mt-0.5">{user?.username || 'Guest'}</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-white/50">
                    <button
                        onClick={() => setActiveSection('profile')}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${activeSection === 'profile'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                            }`}
                    >
                        <User size={20} />
                    </button>

                    <button className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all duration-300 relative group">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-white text-orange-600 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-orange-600 shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default CustomerHeader;
