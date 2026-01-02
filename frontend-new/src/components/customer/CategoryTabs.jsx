import React from 'react';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
    return (
        <div className="sticky top-[81px] z-30 bg-white/60 backdrop-blur-xl border-b border-white/20 py-4 overflow-x-auto no-scrollbar px-6 shadow-sm shadow-slate-200/20 transition-all duration-300">
            <div className="flex items-center gap-3 max-w-7xl mx-auto">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`whitespace-nowrap px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 transform ${activeCategory === null
                            ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 scale-105'
                            : 'bg-white/50 text-slate-400 hover:text-orange-600 hover:bg-white border border-transparent hover:border-orange-100 hover:shadow-lg hover:shadow-slate-200/50'
                        }`}
                >
                    All Items
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`whitespace-nowrap px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 transform ${activeCategory === cat.id
                                ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 scale-105'
                                : 'bg-white/50 text-slate-400 hover:text-orange-600 hover:bg-white border border-transparent hover:border-orange-100 hover:shadow-lg hover:shadow-slate-200/50'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabs;
