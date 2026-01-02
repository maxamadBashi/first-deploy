import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, Check, X } from 'lucide-react';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', sort_order: 0 });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await API.get('/admin/menu');
            setCategories(res.data.categories);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setLoading(false);
        }
    };

    const [editingCategory, setEditingCategory] = useState(null);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/categories', newCategory);
            setNewCategory({ name: '', sort_order: 0 });
            setShowAdd(false);
            fetchCategories();
        } catch (err) {
            alert('Fashil: ' + err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.patch(`/admin/categories/${editingCategory.id}`, editingCategory);
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            alert('Fashil: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ma huba dhalista qaybtan? Dhammaan cuntooyinka ku jira way sii jiri doonaan laakiin ma yeelan doonaan qayb.')) {
            try {
                await API.delete(`/admin/categories/${id}`);
                fetchCategories();
            } catch (err) {
                alert('Fashil: ' + err.message);
            }
        }
    };

    const toggleVisibility = async (cat) => {
        try {
            await API.patch(`/admin/categories/${cat.id}`, { is_visible: !cat.is_visible });
            fetchCategories();
        } catch (err) {
            alert('Fashil: ' + err.message);
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading categories...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Food Categories</h2>
                    <p className="text-slate-500 font-medium mt-1">U qeybi cuntadaada qaybo kala duwan.</p>
                </div>
                {!showAdd && (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                )}
            </div>

            {showAdd && (
                <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-xl shadow-indigo-50/50 animate-in zoom-in-95 duration-200">
                    <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                            <input required type="text" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. Fast Food" />
                        </div>
                        <div className="w-24 space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort</label>
                            <input type="number" value={newCategory.sort_order} onChange={e => setNewCategory({ ...newCategory, sort_order: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all"><Check /></button>
                            <button type="button" onClick={() => setShowAdd(false)} className="bg-slate-100 text-slate-500 p-3 rounded-xl hover:bg-slate-200 transition-all"><X /></button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-50">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors group">
                            {editingCategory && editingCategory.id === cat.id ? (
                                <form onSubmit={handleUpdate} className="flex-1 flex gap-4 items-end">
                                    <div className="flex-1 space-y-1">
                                        <input required type="text" value={editingCategory.name} onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-2 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm" />
                                    </div>
                                    <div className="w-20 space-y-1">
                                        <input type="number" value={editingCategory.sort_order} onChange={e => setEditingCategory({ ...editingCategory, sort_order: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-2 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all"><Check size={16} /></button>
                                        <button type="button" onClick={() => setEditingCategory(null)} className="bg-slate-200 text-slate-500 p-2 rounded-lg hover:bg-slate-300 transition-all"><X size={16} /></button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="text-slate-300">
                                            <GripVertical size={20} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${cat.is_visible ? 'text-slate-900' : 'text-slate-400 line-through'}`}>{cat.name}</h3>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order: {cat.sort_order}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleVisibility(cat)} className={`p-2 rounded-xl transition-all ${cat.is_visible ? 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50' : 'text-indigo-600 bg-indigo-50'}`}>
                                            {cat.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button onClick={() => setEditingCategory(cat)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default CategoryManager;
