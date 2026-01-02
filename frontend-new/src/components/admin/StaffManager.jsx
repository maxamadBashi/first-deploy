import React, { useEffect, useState } from 'react';
import API from '../../api';
import { UserPlus, Mail, Phone, Shield, MoreVertical, Edit2, Trash2, X } from 'lucide-react';

const StaffManager = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newStaff, setNewStaff] = useState({
        username: '', email: '', password: '', role: 'staff', phone: ''
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await API.get('/admin/staff');
            setStaff(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching staff:', err);
            setLoading(false);
        }
    };

    const [editStaff, setEditStaff] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/staff', newStaff);
            setShowAdd(false);
            setNewStaff({ username: '', email: '', password: '', role: 'staff', phone: '' });
            fetchStaff();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Remove password from payload if it's empty
            const payload = { ...editStaff };
            if (!payload.password) delete payload.password;

            await API.patch(`/admin/staff/${editStaff.id}`, payload);
            setShowEditModal(false);
            setEditStaff(null);
            fetchStaff();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ma huba dhalista shaqaalahan?')) {
            try {
                await API.delete(`/admin/staff/${id}`);
                fetchStaff();
            } catch (err) {
                alert('Error: ' + err.message);
            }
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading staff...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h2>
                    <p className="text-slate-500 font-medium mt-1">Maaree shaqaalaha, doorka ay leeyihiin, iyo macluumaadkooda.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <UserPlus size={20} />
                    Add Staff Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <div key={member.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-100">
                                {member.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 leading-none">{member.username}</h3>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <Shield size={12} className="text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{member.role}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Mail size={16} />
                                <span className="text-sm font-medium">{member.email}</span>
                            </div>
                            {member.phone && (
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Phone size={16} />
                                    <span className="text-sm font-medium">{member.phone}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-2">
                            <button onClick={() => { setEditStaff({ ...member, password: '' }); setShowEditModal(true); }} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm transition-all">Edit</button>
                            <button onClick={() => handleDelete(member.id)} className="px-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-black text-slate-900 mb-6">Ku dar Shaqaale Cusub</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</label>
                                    <input required type="text" value={newStaff.username} onChange={e => setNewStaff({ ...newStaff, username: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="magaca" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role</label>
                                    <select value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold">
                                        <option value="staff">Staff</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                                <input required type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="email@example.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <input required type="password" value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="••••••••" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4">
                                Save Staff Member
                            </button>
                            <button type="button" onClick={() => setShowAdd(false)} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && editStaff && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-900">Wax ka badal Shaqaalaha</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</label>
                                    <input required type="text" value={editStaff.username} onChange={e => setEditStaff({ ...editStaff, username: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="magaca" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role</label>
                                    <select value={editStaff.role} onChange={e => setEditStaff({ ...editStaff, role: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold">
                                        <option value="staff">Staff</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                                <input required type="email" value={editStaff.email} onChange={e => setEditStaff({ ...editStaff, email: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="email@example.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</label>
                                <input type="text" value={editStaff.phone || ''} onChange={e => setEditStaff({ ...editStaff, phone: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="phone number" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Password (leave blank to keep current)</label>
                                <input type="password" value={editStaff.password || ''} onChange={e => setEditStaff({ ...editStaff, password: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="••••••••" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4">
                                Update Staff Member
                            </button>
                            <button type="button" onClick={() => setShowEditModal(false)} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffManager;
