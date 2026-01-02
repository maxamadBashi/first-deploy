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
            <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-[4rem] border-2 border-emerald-100 shadow-2xl shadow-emerald-100/20 max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-emerald-500/20 transform rotate-12">
                    <Check size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">SUCCESSFUL!</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-8">Miiska waa kuu xiran yahay!</p>
                <p className="text-slate-500 font-medium max-w-xs mx-auto italic px-6">Waa laguugu daray booskaaga, si farxad leh noogu imow.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-12 bg-white text-emerald-600 px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-100"
                >
                    Samayso mid kale
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[4rem] p-12 lg:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600" />

            <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Book a Table</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Reserve your premium dining spot</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Desired Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                required
                                type="date"
                                value={formData.reservation_date}
                                onChange={e => setFormData({ ...formData, reservation_date: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-16 pr-6 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 outline-none transition-all duration-300 font-black text-slate-900"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Preferred Time</label>
                        <div className="relative group">
                            <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                required
                                type="time"
                                value={formData.reservation_time}
                                onChange={e => setFormData({ ...formData, reservation_time: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-16 pr-6 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 outline-none transition-all duration-300 font-black text-slate-900"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Total Guests</label>
                    <div className="relative group">
                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <select
                            value={formData.number_of_guests}
                            onChange={e => setFormData({ ...formData, number_of_guests: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-5 pl-16 pr-10 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 outline-none transition-all duration-300 font-black text-slate-900 appearance-none cursor-pointer"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-7 rounded-[2.5rem] font-black text-xl hover:bg-orange-700 shadow-2xl shadow-orange-600/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 group/btn mt-4"
                >
                    Confirm My Table
                    <Check className="group-hover/btn:scale-125 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default ReservationView;
