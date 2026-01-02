import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Plus, Users, Utensils, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';

const TableManager = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTable, setNewTable] = useState({ table_number: '', capacity: 2 });

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await API.get('/admin/tables');
            setTables(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching tables:', err);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/tables', newTable);
            setNewTable({ table_number: '', capacity: 2 });
            setShowAddModal(false);
            fetchTables();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Reserved': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Occupied': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading tables...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Table Management</h2>
                    <p className="text-slate-500 font-medium mt-1">Maaree miisaska iyo ballamaha (reservations).</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Add Table
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tables.map((table) => (
                    <div key={table.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-2xl ${getStatusColor(table.status).split(' ')[0]} ${getStatusColor(table.status).split(' ')[1]}`}>
                                <Utensils size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Table {table.table_number}</h3>
                                <p className="text-sm text-slate-400 font-bold flex items-center justify-center gap-1">
                                    <Users size={14} /> {table.capacity} Seats
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(table.status)}`}>
                                {table.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-6">Ku dar Miis</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Table Number</label>
                                <input required type="text" value={newTable.table_number} onChange={e => setNewTable({ ...newTable, table_number: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. 01" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Capacity (Persons)</label>
                                <input required type="number" value={newTable.capacity} onChange={e => setNewTable({ ...newTable, capacity: Number(e.target.value) })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4">
                                Save Table
                            </button>
                            <button type="button" onClick={() => setShowAddModal(false)} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManager;
