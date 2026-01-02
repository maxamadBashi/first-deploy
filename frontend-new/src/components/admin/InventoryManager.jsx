import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Package, AlertCircle, Plus, ArrowUpRight, ArrowDownRight, Database } from 'lucide-react';

const InventoryManager = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState({ item_name: '', quantity: 0, unit: 'kg', low_stock_threshold: 5 });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await API.get('/admin/inventory');
            setInventory(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching inventory:', err);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/inventory', newItem);
            setShowAdd(false);
            setNewItem({ item_name: '', quantity: 0, unit: 'kg', low_stock_threshold: 5 });
            fetchInventory();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading inventory...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Inventory / Stock</h2>
                    <p className="text-slate-500 font-medium mt-1">La soco alaabta cayrin (ingredients) iyo inta ay la'egtahay.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Add Stock Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {inventory.map((item) => {
                    const isLow = Number(item.quantity) <= Number(item.low_stock_threshold);
                    return (
                        <div key={item.id} className={`bg-white rounded-[2rem] border p-6 shadow-sm group hover:shadow-md transition-all ${isLow ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl ${isLow ? 'bg-rose-100 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <Package size={24} />
                                </div>
                                {isLow && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-100 px-2 py-1 rounded-lg">
                                        <AlertCircle size={12} /> Low Stock
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-1">{item.item_name}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900">{item.quantity}</span>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.unit}</span>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between gap-2">
                                <button className="flex-1 bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-100 transition-colors"><ArrowUpRight size={20} className="mx-auto" /></button>
                                <button className="flex-1 bg-rose-50 text-rose-600 p-2 rounded-xl hover:bg-rose-100 transition-colors"><ArrowDownRight size={20} className="mx-auto" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-6">Ku dar Alaab</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Name</label>
                                <input required type="text" value={newItem.item_name} onChange={e => setNewItem({ ...newItem, item_name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. Rice, Milk" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
                                    <input required type="number" step="0.1" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unit</label>
                                    <select value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold">
                                        <option value="kg">kg</option>
                                        <option value="liters">liters</option>
                                        <option value="pcs">pcs</option>
                                        <option value="grams">grams</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4">
                                Save Inventory Item
                            </button>
                            <button type="button" onClick={() => setShowAdd(false)} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManager;
