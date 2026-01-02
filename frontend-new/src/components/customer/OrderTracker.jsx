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
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <ShoppingBag size={40} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-black text-slate-900">Ma jiraan dalabyo</h3>
            <p className="text-slate-400 font-medium">Weli wax dalab ah maadan samayn.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {orders.map(order => (
                <div key={order.id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID: #{order.id}</p>
                            <h3 className="text-xl font-black text-slate-900 mt-1">{getStatusText(order.status)}</h3>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl">
                            {getStatusIcon(order.status)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {order.items?.map((item, idx) => (
                            <span key={idx} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold ring-1 ring-slate-100">
                                {item.quantity}x {item.name}
                            </span>
                        ))}
                    </div>

                    {order.status === 'Delivered' && (
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <ReviewSystem orderId={order.id} />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-6">
                        <span className="text-2xl font-black text-slate-900">${order.total_amount}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {new Date(order.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderTracker;
