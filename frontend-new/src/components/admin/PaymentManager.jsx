import React, { useState, useEffect } from 'react';
import { DollarSign, Trash2, CheckCircle, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react';
import API from '../../api';

const PaymentManager = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await API.get('/admin/payments');
            setPayments(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.total_amount), 0);

    if (loading) return <div className="p-8 text-center animate-pulse font-bold text-slate-400">Loading Payments...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Finance & Payments</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100">
                    <TrendingUp className="mb-4 opacity-50" size={32} />
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Total Revenue</p>
                    <h3 className="text-4xl font-black mt-2">${totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <CreditCard className="mb-4 text-indigo-500 opacity-50" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Paid Orders</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-2">{payments.length}</h3>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <ShoppingBag className="mb-4 text-orange-500 opacity-50" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Avg Order Value</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-2">
                        ${payments.length > 0 ? (totalRevenue / payments.length).toFixed(2) : '0.00'}
                    </h3>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h4 className="font-black text-slate-900">Recent Transactions</h4>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {payments.map(pay => (
                            <tr key={pay.order_id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <span className="font-bold text-slate-400 text-sm">#{pay.order_id}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="font-black text-slate-900 text-sm">{pay.customer_name || 'Guest'}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="font-black text-emerald-600">${parseFloat(pay.total_amount).toFixed(2)}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-slate-500 text-xs font-bold">{new Date(pay.created_at).toLocaleDateString()}</span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <CheckCircle size={12} /> {pay.payment_status}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentManager;
