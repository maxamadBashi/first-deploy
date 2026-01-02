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
            {/* Drawer Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Cart Drawer */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-50 transform transition-transform duration-500 ease-out shadow-2xl ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="max-w-2xl mx-auto px-6 pt-8 pb-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 rounded-xl text-slate-500">
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dalabkaaga</h2>
                        </div>
                        <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            {count} Items
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar mb-8">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <img src={getFullImageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">{item.name}</h4>
                                    <p className="text-orange-600 font-bold">${item.price}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors"
                                    >
                                        {item.quantity === 1 ? <Trash2 size={16} className="text-rose-500" /> : <Minus size={16} />}
                                    </button>
                                    <span className="font-black text-slate-900 text-sm w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total to pay</span>
                            <span className="text-3xl font-black text-slate-900">${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full bg-orange-500 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-[0.98]"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Floating Bar */}
            {!isOpen && (
                <div className="fixed bottom-0 left-0 right-0 p-4 lg:p-6 z-40 animate-in slide-in-from-bottom-full duration-500">
                    <div
                        className="max-w-4xl mx-auto bg-orange-500 rounded-[2rem] p-4 flex items-center justify-between shadow-2xl shadow-orange-200 border border-white/20 backdrop-blur-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center relative">
                                <ShoppingCart size={24} />
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-orange-600 text-xs font-black rounded-full flex items-center justify-center border-2 border-orange-500">
                                    {count}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Price</p>
                                <p className="text-xl font-black">${total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="bg-white text-orange-600 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-orange-50 transition-all flex items-center gap-2 shadow-xl">
                            Eeg Dalabka
                            <ChevronRight size={18} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartOverlay;
