import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Lock, Save, LogOut, ChevronLeft } from 'lucide-react';
import API from '../../api';

const ProfileView = ({ onBack, onLogout }) => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
            setFormData({
                username: userData.username || '',
                phone: userData.phone || '',
                address: userData.address || '',
                password: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setSaving(true);
        try {
            const res = await API.patch('/customer/profile', formData);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Update failed: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center font-bold text-slate-400 animate-pulse">Loading Profile...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Koontadaada</h1>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-rose-500 font-bold hover:bg-rose-50 px-4 py-2 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    Siga bax
                </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Magaca (Username)</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Telefoonka (Phone)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Cinwaanka (Delivery Address)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                            <textarea
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900 h-24"
                                placeholder="Geli cinwaankaaga si laguu soo gaarsiiyo"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Lock size={20} className="text-orange-500" />
                        Bedel Password-ka
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Password Cusub</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Xaqiiji Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {saving ? (
                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Save size={20} />
                            Keydi Isbedelka
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProfileView;
