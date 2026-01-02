import ReviewSystem from './ReviewSystem';

const OrderTracker = ({ orders }) => {
    // ... existing functions ...
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
