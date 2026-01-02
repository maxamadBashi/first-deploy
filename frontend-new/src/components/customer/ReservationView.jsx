import React, { useState } from 'react';
import { Calendar, Clock, Users, Check } from 'lucide-react';
import API from '../../api';

const ReservationView = ({ onReserved }) => {
    const [formData, setFormData] = useState({
        reservation_date: '',
        reservation_time: '',
        number_of_guests: 2
    });
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/customer/reservations', formData);
            setSuccess(true);
            if (onReserved) onReserved();
        } catch (err) {
            alert('Fashil: ' + err.message);
        }
    };

    if (success) {
        return (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-emerald-100 bg-emerald-50/20">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-100">
                    <Check size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Miiska waa kuu xiran yahay!</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Waa laguugu daray booskaaga, si farxad leh noogu imow.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline"
                >
                    Samayso mid kale
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Qabso Miis (Book a Table)</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Taariikhda (Date)</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="date"
                                value={formData.reservation_date}
                                onChange={e => setFormData({ ...formData, reservation_date: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Waqtiga (Time)</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="time"
                                value={formData.reservation_time}
                                onChange={e => setFormData({ ...formData, reservation_time: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Tirada Dadka (Guests)</label>
                    <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select
                            value={formData.number_of_guests}
                            onChange={e => setFormData({ ...formData, number_of_guests: Number(e.target.value) })}
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold appearance-none"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-[0.98] mt-4"
                >
                    Confirm Reservation
                </button>
            </form>
        </div>
    );
};

export default ReservationView;
