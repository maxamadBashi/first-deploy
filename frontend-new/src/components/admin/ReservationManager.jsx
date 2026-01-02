import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Clock4 } from 'lucide-react';
import API from '../../api';

const ReservationManager = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await API.get('/admin/reservations');
            setReservations(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await API.patch(`/admin/reservations/${id}`, { status });
            fetchReservations();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse font-bold text-slate-400">Loading Reservations...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Reservation Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map(res => (
                    <div key={res.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-black text-slate-900 mb-1">{res.customer_name || 'Guest'}</h4>
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                    <Phone size={12} />
                                    {res.customer_phone}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${res.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                    res.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                                }`}>
                                {res.status}
                            </span>
                        </div>

                        <div className="space-y-3 py-4 border-y border-slate-50 my-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Calendar size={16} className="text-indigo-500" />
                                <span className="font-bold text-sm">{new Date(res.reservation_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock size={16} className="text-indigo-500" />
                                <span className="font-bold text-sm">{res.reservation_time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock4 size={16} className="text-indigo-500" />
                                <span className="font-bold text-sm">Table #{res.table_number || 'TBD'} • {res.number_of_guests} Guests</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => updateStatus(res.id, 'Confirmed')}
                                className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={14} /> Confirm
                            </button>
                            <button
                                onClick={() => updateStatus(res.id, 'Cancelled')}
                                className="flex-1 bg-slate-100 text-slate-500 py-2.5 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle size={14} /> Cancel
                            </button>
                        </div>
                    </div>
                ))}
                {reservations.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="font-bold text-slate-400">No reservations found today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservationManager;
