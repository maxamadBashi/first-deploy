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
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
                <p className="text-slate-500 font-medium mt-1">Galaha maanta iyo xogta guud ee makhaayadda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                                <card.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart Mockup */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="font-black text-slate-900 text-lg mb-6">Sales Activity</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 bg-indigo-100 rounded-t-xl relative group hover:bg-indigo-600 transition-colors" style={{ height: `${h}%` }}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${h * 10}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="font-black text-slate-900 text-lg mb-6">Best Selling Items</h3>
                    <div className="space-y-4">
                        {stats.bestSellingItems && stats.bestSellingItems.length > 0 ? (
                            stats.bestSellingItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-indigo-600 shadow-sm">
                                            {i + 1}
                                        </div>
                                        <span className="font-bold text-slate-800">{item.name}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {item.total_sold} Sold
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-10 font-medium">No sales data yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
