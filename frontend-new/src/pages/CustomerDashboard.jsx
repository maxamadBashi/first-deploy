import React, { useEffect, useState } from 'react';
import API from '../api';
import CustomerHeader from '../components/customer/CustomerHeader';
import CategoryTabs from '../components/customer/CategoryTabs';
import FoodCard from '../components/customer/FoodCard';
import CartOverlay from '../components/customer/CartOverlay';
import OrderTracker from '../components/customer/OrderTracker';
import ReservationView from '../components/customer/ReservationView';
import ProfileView from '../components/customer/ProfileView';
import { UtensilsCrossed } from 'lucide-react';

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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 animate-pulse uppercase tracking-[0.2em]">Karaama Restaurant</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
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

            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeSection === 'menu' ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                {activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'Popular Items'}
                            </h2>
                            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                <UtensilsCrossed size={14} />
                                {filteredItems.length} options
                            </div>
                        </div>

                        {filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredItems.map(item => (
                                    <FoodCard key={item.id} item={item} onAddToCart={addToCart} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <UtensilsCrossed size={40} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Waxba laguma helin</h3>
                                <p className="text-slate-400 font-medium">Qaybtan weli cunto laguma soo darin.</p>
                            </div>
                        )}
                    </>
                ) : activeSection === 'orders' ? (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-8">Dalabyadayda</h2>
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

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Xaqiiji Dalabka</h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Nooca Dalabka (Order Type)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Dine-in', 'Takeaway', 'Delivery'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setOrderType(type)}
                                            className={`py-3 rounded-2xl font-bold text-sm transition-all ${orderType === type
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-100'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                                }`}
                                        >
                                            {type === 'Dine-in' ? 'Fadhi' : type === 'Takeaway' ? 'Kaxaysi' : 'Delivery'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {orderType === 'Delivery' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Cinwaanka (Address)</label>
                                    <textarea
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        placeholder="Geli cinwaankaaga saxda ah..."
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-900 h-24"
                                    />
                                </div>
                            )}

                            <div className="pt-4 space-x-3 flex">
                                <button
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="flex-[2] bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-[0.98]"
                                >
                                    Confirm Order
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
