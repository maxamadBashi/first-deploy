import React, { useEffect, useState } from 'react';
import API from '../api';
import CustomerHeader from '../components/customer/CustomerHeader';
import CategoryTabs from '../components/customer/CategoryTabs';
import FoodCard from '../components/customer/FoodCard';
import CartOverlay from '../components/customer/CartOverlay';
import OrderTracker from '../components/customer/OrderTracker';
import ReservationView from '../components/customer/ReservationView';
import ProfileView from '../components/customer/ProfileView';
import { UtensilsCrossed, X, ChevronRight } from 'lucide-react';

const CustomerDashboard = ({ user }) => {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSection, setActiveSection] = useState('menu');
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState([]);
    const [orderType, setOrderType] = useState('Dine-in');
    const [address, setAddress] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get('/customer/my-orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await API.get('/customer/menu');
            setCategories(res.data.categories);
            setItems(res.data.items);
            setFilteredItems(res.data.items);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching menu:', err);
            setLoading(false);
        }
    };

    const handleCategoryChange = (catId) => {
        setActiveCategory(catId);
        if (catId === null) {
            setFilteredItems(items);
        } else {
            const categoryObj = categories.find(c => c.id === catId);
            if (categoryObj) {
                const searchName = categoryObj.name.toLowerCase().trim();
                setFilteredItems(items.filter(item =>
                    item.category && item.category.toLowerCase().trim() === searchName
                ));
            } else {
                setFilteredItems([]);
            }
        }
    };

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) {
            setCart(prev => prev.filter(item => item.id !== id));
        } else {
            setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
        }
    };

    const handleCheckout = async () => {
        if (orderType === 'Delivery' && !address) {
            alert('Fadlan geli cinwaankaaga (Please enter address)');
            return;
        }

        try {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await API.post('/customer/orders', {
                items: cart,
                total_amount: total,
                order_type: orderType,
                address: orderType === 'Delivery' ? address : null
            });
            alert('Dalabkaaga waa la helay! (Order received)');
            setCart([]);
            setShowCheckoutModal(false);
            fetchOrders();
            setActiveSection('orders');
        } catch (err) {
            alert('Fashil: ' + err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 via-white to-orange-50/30 -z-10" />
            <div className="w-20 h-20 border-[6px] border-orange-100 border-t-orange-600 rounded-full animate-spin shadow-xl shadow-orange-100/50"></div>
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Karaama</h1>
                <p className="font-black text-slate-400 animate-pulse uppercase tracking-[0.4em] text-[10px]">Restaurant System</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-50/40 via-slate-50 to-white pb-32 transition-colors duration-500">
            <CustomerHeader
                user={user}
                cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            {activeSection === 'menu' && (
                <CategoryTabs
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />
            )}

            <main className="max-w-7xl mx-auto px-6 py-12">
                {activeSection === 'menu' ? (
                    <>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                            <div className="space-y-1">
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                                    {activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'Popular Items'}
                                </h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Hand-picked deliciousness just for you</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100/50">
                                <UtensilsCrossed size={18} className="text-orange-600" />
                                <span className="font-black text-slate-900 uppercase text-xs tracking-widest">
                                    {filteredItems.length} Selections
                                </span>
                            </div>
                        </div>

                        {filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredItems.map(item => (
                                    <FoodCard key={item.id} item={item} onAddToCart={addToCart} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-[4rem] border-2 border-dashed border-slate-200 shadow-inner">
                                <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <UtensilsCrossed size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Waxba laguma helin</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Qaybtan weli cunto laguma soo darin</p>
                            </div>
                        )}
                    </>
                ) : activeSection === 'orders' ? (
                    <div className="max-w-3xl mx-auto py-8">
                        <div className="mb-12">
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">My Orders</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Track your active and previous meals</p>
                        </div>
                        <OrderTracker orders={orders} />
                    </div>
                ) : activeSection === 'profile' ? (
                    <ProfileView onBack={() => setActiveSection('menu')} onLogout={handleLogout} />
                ) : (
                    <ReservationView onReserved={() => setActiveSection('menu')} />
                )}
            </main>

            {activeSection === 'menu' && (
                <CartOverlay
                    cart={cart}
                    onCheckout={() => setShowCheckoutModal(true)}
                    onUpdateQuantity={updateQuantity}
                />
            )}

            {/* Premium Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4 transition-all duration-500">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Confirm Order</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Final steps to your meal</p>
                            </div>
                            <button
                                onClick={() => setShowCheckoutModal(false)}
                                className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Dining Preference</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'Dine-in', label: 'Fadhi', icon: '🍽️' },
                                        { id: 'Takeaway', label: 'Kaxaysi', icon: '🥡' },
                                        { id: 'Delivery', label: 'Delivery', icon: '🛵' }
                                    ].map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setOrderType(type.id)}
                                            className={`p-5 rounded-[2rem] flex flex-col items-center gap-2 transition-all duration-500 border-2 ${orderType === type.id
                                                ? 'bg-orange-600 border-orange-600 text-white shadow-2xl shadow-orange-600/30 scale-105'
                                                : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-orange-100 hover:shadow-xl'
                                                }`}
                                        >
                                            <span className="text-2xl mb-1">{type.icon}</span>
                                            <span className="font-black text-[11px] uppercase tracking-widest">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {orderType === 'Delivery' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Delivery Address</label>
                                    <textarea
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        placeholder="Where should we bring your food?"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 outline-none transition-all duration-300 font-bold text-slate-900 h-32 placeholder:text-slate-300 placeholder:italic"
                                    />
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="flex-1 bg-slate-50 text-slate-400 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="flex-[2] bg-orange-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-orange-600/30 hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center gap-3 group/confirm"
                                >
                                    Confirm Order
                                    <ChevronRight className="group-hover/confirm:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
