import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Plus, Edit2, Trash2, Search, Filter, Check, X, Image as ImageIcon } from 'lucide-react';

const MenuManager = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_available: true,
        discount: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get('/admin/menu');
            setItems(res.data.items);
            setCategories(res.data.categories);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching menu data:', err);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const [editItem, setEditItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('description', newItem.description);
            formData.append('price', newItem.price);
            formData.append('category_id', newItem.category_id);
            formData.append('discount', newItem.discount);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await API.post('/admin/menu-items', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowAddModal(false);
            setNewItem({ name: '', description: '', price: '', category_id: '', image_url: '', is_available: true, discount: 0 });
            setImageFile(null);
            setPreview(null);
            fetchData();
        } catch (err) {
            alert('Fashil: ' + err.message);
        }
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', editItem.name);
            formData.append('description', editItem.description);
            formData.append('price', editItem.price);
            formData.append('category_id', editItem.category_id);
            formData.append('discount', editItem.discount);
            formData.append('is_available', editItem.is_available);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await API.patch(`/admin/menu-items/${editItem.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowEditModal(false);
            setEditItem(null);
            setImageFile(null);
            setPreview(null);
            fetchData();
        } catch (err) {
            alert('Fashil: ' + err.message);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Ma huba dhalista cuntadan?')) {
            try {
                await API.delete(`/admin/menu-items/${id}`);
                fetchData();
            } catch (err) {
                alert('Fashil: ' + err.message);
            }
        }
    };

    const openEditModal = (item) => {
        setEditItem({ ...item, category_id: categories.find(c => c.name === item.category)?.id || '' });
        setPreview(item.image_url);
        setShowEditModal(true);
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const itemCategoryName = item.category ? item.category.toLowerCase().trim() : '';
        const selectedCategoryName = categories.find(c => c.id.toString() === selectedCategory.toString())?.name.toLowerCase().trim() || '';

        const matchesCategory = selectedCategory === '' || itemCategoryName === selectedCategoryName;

        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="text-center py-20 animate-pulse">Loading menu...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Menu Management</h2>
                    <p className="text-slate-500 font-medium mt-1">Maaree cuntada, qiimaha, iyo helitaankooda.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Add New Food
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for food..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-semibold text-slate-600"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-slate-100 relative">
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={() => openEditModal(item)} className="p-2 bg-white/90 backdrop-blur-sm text-indigo-600 rounded-xl hover:bg-white transition-all shadow-lg"><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="p-2 bg-white/90 backdrop-blur-sm text-rose-600 rounded-xl hover:bg-white transition-all shadow-lg"><Trash2 size={16} /></button>
                            </div>
                            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.is_available ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {item.is_available ? 'Available' : 'Out of Stock'}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h3>
                                <span className="font-black text-indigo-600">${item.price}</span>
                            </div>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium h-10">{item.description}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">
                                    {item.category || 'Uncategorized'}
                                </span>
                                {item.discount > 0 && (
                                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg">
                                        -{item.discount}% Off
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal (Simple) */}
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-slate-900">Ku dar Cunto Cusub</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X /></button>
                            </div>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Food Name</label>
                                        <input required type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Salad, Burger, etc." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                                        <input required type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="10.00" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                    <select required value={newItem.category_id} onChange={e => setNewItem({ ...newItem, category_id: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Food Image</label>
                                    <div className="flex items-center gap-4">
                                        {preview ? (
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                                                <ImageIcon size={24} />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="food-image"
                                            />
                                            <label
                                                htmlFor="food-image"
                                                className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors"
                                            >
                                                {preview ? 'Change Image' : 'Choose Image'}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                    <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none h-24" placeholder="Brief description..."></textarea>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4">
                                    Save Food Item
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
            {/* Edit Modal */}
            {
                showEditModal && editItem && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-slate-900">Wax ka badal Cuntada</h3>
                                <button onClick={() => { setShowEditModal(false); setPreview(null); setImageFile(null); }} className="text-slate-400 hover:text-slate-600"><X /></button>
                            </div>
                            <form onSubmit={handleUpdateItem} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Food Name</label>
                                        <input required type="text" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Salad, Burger, etc." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                                        <input required type="number" step="0.01" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="10.00" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                        <select required value={editItem.category_id} onChange={e => setEditItem({ ...editItem, category_id: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none">
                                            <option value="">Select Category</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Discount (%)</label>
                                        <input type="number" value={editItem.discount} onChange={e => setEditItem({ ...editItem, discount: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="0" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Food Image</label>
                                    <div className="flex items-center gap-4">
                                        {(preview || editItem.image_url) && (
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                                <img src={preview || editItem.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="edit-food-image" />
                                            <label htmlFor="edit-food-image" className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors">
                                                Change Image
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 py-2">
                                    <input type="checkbox" id="availability" checked={editItem.is_available} onChange={e => setEditItem({ ...editItem, is_available: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <label htmlFor="availability" className="font-bold text-slate-700">Waa la helayaa (Available)</label>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                    <textarea value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none h-24" placeholder="Brief description..."></textarea>
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4">
                                    Update Food Item
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default MenuManager;
