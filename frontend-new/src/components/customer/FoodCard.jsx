import React from 'react';
import { Flame, Star, Clock, Plus } from 'lucide-react';
import API from '../../api';

const FoodCard = ({ item, onAddToCart }) => {
    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const baseUrl = API.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${url}`;
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-2xl shadow-slate-200/30 hover:shadow-orange-100/40 hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-5">
                {item.image_url ? (
                    <img
                        src={getFullImageUrl(item.image_url)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Flame size={48} className="animate-pulse" />
                    </div>
                )}

                {/* Overlay Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {item.discount_percentage > 0 && (
                        <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-xl shadow-orange-500/20">
                            -{Math.round(item.discount_percentage)}%
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-xl">
                        <Star size={16} className="fill-orange-500 text-orange-500" />
                    </div>
                </div>
            </div>

            <div className="px-2 flex flex-col flex-1">
                <div className="flex flex-col mb-4">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors duration-300 uppercase tracking-tighter line-clamp-1">
                        {item.name}
                    </h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                        {item.category || 'Kitchen Choice'}
                    </p>
                </div>

                <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6 flex-1 italic">
                    {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">${item.price}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Clock size={12} className="text-orange-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">15-20 Min</span>
                        </div>
                    </div>
                    <button
                        onClick={() => onAddToCart(item)}
                        className="bg-orange-600 text-white p-4 rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
                    >
                        <Plus size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
