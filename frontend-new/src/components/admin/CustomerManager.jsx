import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import API from '../../api';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await API.get('/admin/customers');
            setCustomers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse font-bold text-slate-400">Loading Customers...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Customer Management</h2>
            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Info</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Orders</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Spent</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {customers.map(cust => (
                            <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-black">
                                            {cust.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 leading-none">{cust.username}</p>
                                            <p className="text-xs text-slate-400 font-bold mt-1.5 flex items-center gap-1">
                                                <Mail size={12} /> {cust.email}
                                            </p>
                                            {cust.phone && (
                                                <p className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1">
                                                    <Phone size={12} /> {cust.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black">
                                        {cust.total_orders}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="text-emerald-600 font-black">
                                        ${parseFloat(cust.total_spent || 0).toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="text-slate-500 text-xs font-bold leading-none">
                                        {new Date(cust.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {customers.length === 0 && (
                    <div className="py-20 text-center font-bold text-slate-400">No customers registered yet.</div>
                )}
            </div>
        </div>
    );
};

export default CustomerManager;
