import React, { useEffect, useState } from 'react';
import API from '../../api';
import { Save, Building2, MapPin, Globe, Clock, Percent, DollarSign, Bell } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        restaurant_name: '',
        address: '',
        currency: 'USD',
        tax_percentage: '0',
        opening_hours: '',
        delivery_charge: '0',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await API.get('/admin/settings');
                if (Object.keys(res.data).length > 0) {
                    setSettings(prev => ({ ...prev, ...res.data }));
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching settings:', err);
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            for (const [key, value] of Object.entries(settings)) {
                await API.post('/admin/settings', { key, value });
            }
            alert('Settings la keydiyay!');
        } catch (err) {
            alert('Fashil: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Loading settings...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
                <p className="text-slate-500 font-medium mt-1">Maaree xogta makhaayadda, canshuuraha, iyo saacadaha shaqada.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-8">
                    {/* General Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <Building2 size={20} className="text-indigo-600" />
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Restaurant Info</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Restaurant Name</label>
                                <input name="restaurant_name" value={settings.restaurant_name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="My Awesome Restaurant" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input name="address" value={settings.address} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 pl-10 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Mogadishu, Somalia" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Settings */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <DollarSign size={20} className="text-indigo-600" />
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Finances & Taxes</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Currency</label>
                                <select name="currency" value={settings.currency} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold">
                                    <option value="USD">USD ($)</option>
                                    <option value="SOS">SOS (Sh.So.)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tax Percentage (%)</label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="number" name="tax_percentage" value={settings.tax_percentage} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 pl-10 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Charge</label>
                                <input type="number" name="delivery_charge" value={settings.delivery_charge} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <Clock size={20} className="text-indigo-600" />
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Operations</h3>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Opening Hours</label>
                            <input name="opening_hours" value={settings.opening_hours} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. 8:00 AM - 10:00 PM" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                        <Save size={24} />
                        {saving ? 'Keydinaya...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
