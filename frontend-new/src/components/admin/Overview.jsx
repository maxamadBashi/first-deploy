import React, { useEffect, useState } from 'react';
import API from '../../api';
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';

const Overview = () => {
    const [stats, setStats] = useState({
        salesToday: 0,
        totalOrders: 0,
        activeOrders: 0,
        totalCustomers: 0,
        bestSellingItems: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Sales (Today)', value: `$${stats.salesToday}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Active Orders', value: stats.activeOrders, icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/30">
                <h2 className="text-4xl font-black tracking-tight mb-2 drop-shadow-lg">Dashboard Overview</h2>
                <p className="text-indigo-100 font-medium text-lg">Galaha maanta iyo xogta guud ee makhaayadda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="card-gradient p-6 group cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-3xl ${card.bg} ${card.color} group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                <card.icon size={28} />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{card.label}</span>
                        </div>
                        <p className="text-3xl font-black text-gradient">{card.value}</p>
                        <div className="mt-4 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart Mockup */}
                <div className="card-gradient p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-slate-900 text-xl">Sales Activity</h3>
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl text-white">
                            <BarChart3 size={20} />
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-3">
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 via-purple-600 to-pink-500 rounded-t-2xl relative group hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg" style={{ height: `${h}%` }}>
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
                                    ${h * 10}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="card-gradient p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-slate-900 text-xl">Best Selling Items</h3>
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {stats.bestSellingItems && stats.bestSellingItems.length > 0 ? (
                            stats.bestSellingItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-white via-indigo-50/30 to-purple-50/30 rounded-2xl border-2 border-white/60 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform">
                                            {i + 1}
                                        </div>
                                        <span className="font-black text-slate-800 text-lg">{item.name}</span>
                                    </div>
                                    <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                                        {item.total_sold} Sold
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-2xl mb-4">
                                    <TrendingUp size={32} className="text-slate-400" />
                                </div>
                                <p className="text-slate-500 font-medium">No sales data yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
