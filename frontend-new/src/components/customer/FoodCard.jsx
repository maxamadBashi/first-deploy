import React from 'react';
import { Flame, Star, Clock, Plus } from 'lucide-react';

const FoodCard = ({ item, onAddToCart }) => {
    return (
        <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-4">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Star size={48} />
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                    {item.discount_percentage > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                            -{Math.round(item.discount_percentage)}%
                        </span>
                    )}
                </div>
            </div>

            <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-500 transition-colors uppercase tracking-tight truncate">{item.name}</h3>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">450g / Ingredients</p>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <Flame size={12} /> Spicy
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <Star size={12} /> Bestseller
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900">${item.price}</span>
                        {item.discount_percentage > 0 && (
                            <span className="text-xs font-bold text-slate-400 line-through">
                                ${(item.price / (1 - item.discount_percentage / 100)).toFixed(2)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => onAddToCart(item)}
                        className="bg-orange-500 text-white px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-orange-600 shadow-lg shadow-orange-100 active:scale-95 transition-all"
                    >
                        Order now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
