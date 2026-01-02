import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import API from '../../api';

const ReviewSystem = ({ orderId, onComplete }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Fadlan dooro xiddigaha (Please select stars)');
            return;
        }
        setSubmitting(true);
        try {
            await API.post('/customer/reviews', {
                order_id: orderId,
                rating,
                comment
            });
            alert('Mahadsanid! Qiimeyntaada waa la helay.');
            if (onComplete) onComplete();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSubmitting(true);
        }
    };

    return (
        <div className="bg-orange-50 rounded-[2rem] p-6 border border-orange-100 animate-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                    <Star size={20} fill="currentColor" />
                </div>
                <div>
                    <h4 className="font-black text-slate-900 leading-tight">Qiimee Cuntada</h4>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Rate your experience</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90"
                    >
                        <Star
                            size={32}
                            className={`transition-colors ${(hover || rating) >= star ? 'text-orange-500' : 'text-slate-200'
                                }`}
                            fill={(hover || rating) >= star ? 'currentColor' : 'none'}
                        />
                    </button>
                ))}
            </div>

            <div className="relative mb-4">
                <MessageSquare className="absolute left-4 top-4 text-slate-300" size={18} />
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900 h-24 text-sm"
                    placeholder="Maxaad naga dhihi lahayd? (Your feedback...)"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50"
            >
                {submitting ? 'Diraya...' : (
                    <>
                        <Send size={18} />
                        Dir Qiimeynta
                    </>
                )}
            </button>
        </div>
    );
};

export default ReviewSystem;
