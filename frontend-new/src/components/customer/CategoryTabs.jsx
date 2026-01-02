import React from 'react';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
    return (
        <div className="sticky top-[73px] z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 overflow-x-auto no-scrollbar px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${activeCategory === null
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 lg:scale-105'
                            : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                        }`}
                >
                    All items
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${activeCategory === cat.id
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 lg:scale-105'
                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
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
