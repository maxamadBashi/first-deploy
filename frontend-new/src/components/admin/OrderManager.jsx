import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Eye, CheckCircle, Clock, XCircle, Printer, Coffee, Package, Truck, MoreVertical } from 'lucide-react';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get('/admin/orders');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await API.patch(`/admin/orders/${id}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Accepted': return 'bg-sky-50 text-sky-600 border-sky-100';
            case 'Preparing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Ready': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Delivered': return 'bg-slate-50 text-slate-400 border-slate-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={14} />;
            case 'Preparing': return <Coffee size={14} />;
            case 'Ready': return <Package size={14} />;
            case 'Delivered': return <CheckCircle size={14} />;
            case 'Cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading orders...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h2>
                <p className="text-slate-500 font-medium mt-1">La soco dalabaadka tooska ah iyo heerarkooda.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer / Table</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Created</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-slate-900">#{order.id}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-slate-900">{order.customer_name || 'Guest'}</span>
                                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${order.order_type === 'Delivery' ? 'bg-orange-50 text-orange-600' :
                                                        order.order_type === 'Takeaway' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                                                    }`}>
                                                    {order.order_type === 'Dine-in' ? 'Fadhi' : order.order_type === 'Takeaway' ? 'Kaxaysi' : 'Delivery'}
                                                </span>
                                            </div>
                                            {order.table_number && (
                                                <span className="text-xs text-indigo-500 font-bold flex items-center gap-1">
                                                    <Coffee size={12} /> Table {order.table_number}
                                                </span>
                                            )}
                                            {order.order_type === 'Delivery' && order.address && (
                                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1 max-w-[200px] leading-tight">
                                                    <Truck size={12} className="shrink-0" /> {order.address}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-indigo-600">${order.total_amount}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium text-slate-500">
                                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => updateStatus(order.id, 'Preparing')}
                                                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                                                title="Start Preparing"
                                            >
                                                <Coffee size={18} />
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order.id, 'Ready')}
                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                                                title="Mark as Ready"
                                            >
                                                <Package size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600">
                                                <Printer size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManager;
