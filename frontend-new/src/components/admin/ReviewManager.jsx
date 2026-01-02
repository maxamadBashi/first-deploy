import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Calendar, Utensils } from 'lucide-react';
import API from '../../api';

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await API.get('/admin/reviews');
            setReviews(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse font-bold text-slate-400">Loading Reviews...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Customer Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(rev => (
                    <div key={rev.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 p-8">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={14}
                                        className={star <= rev.rating ? 'text-orange-500' : 'text-slate-100'}
                                        fill={star <= rev.rating ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                                {rev.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 leading-none">{rev.username}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                                    <Calendar size={12} /> {new Date(rev.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl mb-4 relative">
                            <MessageSquare className="absolute -top-3 left-6 text-orange-200" size={24} fill="currentColor" />
                            <p className="text-slate-600 font-medium italic text-sm">"{rev.comment || 'No comment provided.'}"</p>
                        </div>

                        {rev.item_name && (
                            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs bg-indigo-50 w-fit px-3 py-1.5 rounded-xl">
                                <Utensils size={12} />
                                Ordered: {rev.item_name}
                            </div>
                        )}
                    </div>
                ))}
                {reviews.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 font-bold text-slate-400">
                        No reviews yet. Feedback helps us grow!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManager;
