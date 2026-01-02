import React, { useState } from 'react';
import { ShoppingCart, ChevronRight, Plus, Minus, X, Trash2, ArrowLeft } from 'lucide-react';
import API from '../../api';


const CartOverlay = ({ cart, onCheckout, onUpdateQuantity, onRemoveItem }) => {
    const [isOpen, setIsOpen] = useState(false);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (count === 0) return null;

    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = API.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${url}`;
    };

    return (
        <>
            {/* Dark Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Premium Side Cart Panel */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-[0_0_50px_rgba(0,0,0,0.1)] transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Your Order</h2>
                            <span className="bg-orange-600 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20">
                                {count} Items
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Review your delicious selection</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all duration-300"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="group flex items-center gap-5 p-5 bg-white rounded-[2rem] border border-slate-100 hover:border-orange-100 transition-all duration-300 hover:shadow-xl hover:shadow-orange-100/20">
                            <div className="w-24 h-24 bg-slate-50 rounded-[1.5rem] overflow-hidden shadow-sm relative shrink-0">
                                <img
                                    src={getFullImageUrl(item.image_url)}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg leading-tight truncate mb-1">
                                    {item.name}
                                </h4>
                                <p className="text-orange-600 font-black text-sm mb-4">${item.price}</p>

                                <div className="flex items-center gap-3 w-fit bg-slate-100 p-1 rounded-xl border border-white">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-600 transition-colors bg-white rounded-lg shadow-sm"
                                    >
                                        {item.quantity === 1 ? <Trash2 size={16} className="text-rose-500" /> : <Minus size={16} />}
                                    </button>
                                    <span className="font-black text-slate-900 text-xs w-5 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-600 transition-colors bg-white rounded-lg shadow-sm"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Summary */}
                <div className="p-8 bg-slate-50/50 backdrop-blur-xl border-t border-slate-100 space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span>Delivery Fee</span>
                            <span className="text-emerald-500">Free</span>
                        </div>
                        <div className="h-px bg-slate-200/50 w-full" />
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={onCheckout}
                        className="w-full bg-orange-600 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-orange-700 shadow-2xl shadow-orange-600/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 group/btn"
                    >
                        Place My Order
                        <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Floating Summary Bar (Appears when panel is closed) */}
            {!isOpen && (
                <div className="fixed bottom-0 left-0 right-0 p-6 z-50 animate-in slide-in-from-bottom-10 duration-700">
                    <div
                        className="max-w-4xl mx-auto bg-orange-600 rounded-[2.5rem] p-5 flex items-center justify-between shadow-2xl shadow-orange-600/30 border border-white/20 backdrop-blur-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="flex items-center gap-5 text-white">
                            <div className="w-14 h-14 bg-white/20 rounded-[1.25rem] flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                                <ShoppingCart size={28} />
                                <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 bg-white text-orange-600 text-[11px] font-black rounded-full flex items-center justify-center border-2 border-orange-600 shadow-lg">
                                    {count}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Order Summary</p>
                                <p className="text-2xl font-black tracking-tighter">${total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-300 flex items-center gap-3 shadow-xl backdrop-blur-sm">
                            Eeg Dalabka
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartOverlay;
