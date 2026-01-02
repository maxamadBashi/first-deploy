import React from 'react';
import { Package, ChefHat, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import ReviewSystem from './ReviewSystem';

const OrderTracker = ({ orders }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="text-amber-500" />;
            case 'Accepted': return <Package className="text-blue-500" />;
            case 'Preparing': return <ChefHat className="text-orange-500" />;
            case 'Ready': return <CheckCircle className="text-emerald-500" />;
            case 'Delivered': return <CheckCircle className="text-slate-400" />;
            default: return <Clock className="text-slate-400" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending': return 'Dalab la helay';
            case 'Accepted': return 'Waa la aqbalay';
            case 'Preparing': return 'Diyaarin ayaa ku jira';
            case 'Ready': return 'Wuu diyaar yahay';
            case 'Delivered': return 'Waa la keenay';
            default: return status;
        }
    };

    if (orders.length === 0) return (
        <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-[4rem] border-2 border-dashed border-slate-200 shadow-inner">
            <ShoppingBag size={48} className="mx-auto text-slate-200 mb-6 transform -rotate-12" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Ma jiraan dalabyo</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Weli wax dalab ah maadan samayn</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {orders.map(order => (
                <div key={order.id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group hover:border-orange-100 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-[5rem] -z-10 group-hover:bg-orange-100/50 transition-colors duration-500" />

                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Transaction ID: <span className="text-slate-900">#ORD-{order.id}</span></p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{getStatusText(order.status)}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'Ready' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Status</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group-hover:scale-110 transition-transform duration-500">
                            {getStatusIcon(order.status)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 text-slate-900 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest ring-1 ring-slate-100 flex items-center gap-3 group-hover:bg-white group-hover:shadow-lg transition-all">
                                <span className="text-orange-600">{item.quantity}x</span>
                                {item.name}
                            </div>
                        ))}
                    </div>

                    {order.status === 'Delivered' && (
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <ReviewSystem orderId={order.id} />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-8 border-t border-slate-100/50 mt-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Paid</span>
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">${order.total_amount}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Ordered On</span>
                            <span className="text-xs font-black text-slate-900 px-4 py-2 bg-slate-50 rounded-xl">
                                {new Date(order.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderTracker;
