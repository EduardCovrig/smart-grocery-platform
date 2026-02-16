import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { User, MapPin, Package, LogOut, Loader2, Plus, Trash2, CheckCircle2, AlertTriangle, ArrowLeft, X, ShoppingBag } from "lucide-react";
import axios from "axios";

interface Address {
    id: number;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    isDefaultDelivery: boolean;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    basePrice: number;
    productId: number; //adaugat pt click pe produs si redirect la pagina produsului
    productName: string;
    subTotal: number;
    imageUrl?: string; // Adaugat pt afisare
}

interface Order {
    id: number;
    createdAt: string;
    status: string;
    totalPrice: number;
    items: OrderItem[];
}

export default function Profile() {
    const { token, logout } = useAuth();

    // Stari pentru tab-uri (navigation)
    const [activeTab, setActiveTab] = useState<'details' | 'orders' | 'addresses'>('details');
    const [isLoading, setIsLoading] = useState(true);

    // Datele utilizatorului & Entitati
    const [profileData, setProfileData] = useState({ id: 0, firstName: "", lastName: "", email: "", phoneNumber: "" });
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    // Stari pt formulare adrese
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ street: "", city: "", zipCode: "", country: "Romania" });

    // Stari pt update profil si parola
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
    const [newPassword, setNewPassword] = useState("");

    // Stari pt Modalul de Parola
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [isConfirmingPwd, setIsConfirmingPwd] = useState(false);
    const [modalError, setModalError] = useState("");

    // --- FETCH ALL DATA INITIALLY ---
    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const headers = { Authorization: `Bearer ${token}` };

            const [userRes, addrRes, ordersRes] = await Promise.all([
                axios.get(`${apiUrl}/users/me`, { headers }),
                axios.get(`${apiUrl}/addresses`, { headers }),
                axios.get(`${apiUrl}/orders`, { headers })
            ]);

            setProfileData(userRes.data);
            setAddresses(addrRes.data.sort((a: Address, b: Address) => a.id - b.id));

            const sortedOrders = ordersRes.data.sort((a: Order, b: Order) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(sortedOrders);

        } catch (err) {
            console.error("Error fetching profile data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // --- EXECUTA UPDATE-UL EFECTIV IN DB ---
    const executeProfileUpdate = async () => {
        setIsUpdatingProfile(true);
        setProfileMsg({ type: "", text: "" });
        try {
            const apiUrl = import.meta.env.VITE_API_URL;

            // Construim payload-ul (daca are parola noua, o trimitem)
            const payload: any = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phoneNumber: profileData.phoneNumber
            };
            if (newPassword.trim().length > 0) {
                payload.password = newPassword;
            }

            await axios.put(`${apiUrl}/users/me`, payload, { headers: { Authorization: `Bearer ${token}` } });

            setProfileMsg({ type: "success", text: "Profile updated successfully!" });
            setNewPassword(""); // Curatam campul de parola dupa succes
        } catch (err) {
            setProfileMsg({ type: "error", text: "Failed to update profile." });
        } finally {
            setIsUpdatingProfile(false);
            setTimeout(() => setProfileMsg({ type: "", text: "" }), 3000);
        }
    };

    // --- HANDLER SUBMIT FORMULAR PROFIL ---
    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();

        // Daca vrea sa schimbe parola, deschidem modalul si oprim trimiterea
        if (newPassword.trim().length > 0) {
            setShowPasswordModal(true);
            setModalError("");
            setCurrentPassword("");
            return;
        }

        // Altfel, daca schimba doar numele/telefonul, trimitem direct
        executeProfileUpdate();
    };

    // --- VERIFICARE PAROLA VECHE IN MODAL ---
    const handleConfirmOldPassword = async () => {
        setIsConfirmingPwd(true);
        setModalError("");
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            // 1. Facem un pseudo-login ca sa vedem daca parola veche e corecta
            await axios.post(`${apiUrl}/auth/login`, {
                email: profileData.email,
                password: currentPassword
            });

            // 2. Daca a mers (parola veche e ok), inchidem modalul si facem update-ul real
            setShowPasswordModal(false);
            await executeProfileUpdate();

        } catch (err) {
            setModalError("Incorrect current password.");
        } finally {
            setIsConfirmingPwd(false);
        }
    };

    // --- ACTIONS PENTRU ADRESE ---
    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const isFirstAddress = addresses.length === 0;
            const payload = { ...newAddress, isDefaultDelivery: isFirstAddress, userId: profileData.id };

            await axios.post(`${apiUrl}/addresses`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowAddAddressForm(false);
            setNewAddress({ street: "", city: "", zipCode: "", country: "Romania" });
            fetchAllData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetDefaultAddress = async (addr: Address) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const payload = { ...addr, isDefaultDelivery: true, userId: profileData.id };
            await axios.put(`${apiUrl}/addresses/${addr.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            await axios.delete(`${apiUrl}/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (err) {
            console.error(err);
        }
    };

    // --- UTILS ---
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
        {/*Numeric -> nr, short -> Jan, long -> January */ }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMED': return 'bg-blue-100 text-[#134c9c] border-blue-200 hover:bg-[#134c9c] hover:text-white';
            case 'PROCESSING': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 size={50} className="animate-spin text-[#134c9c]" />
            </div>
        );
    }

    return (
        <div className="min-h-[93vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-12 relative">

            {/* --- MODAL CONFIRMARE PAROLA --- */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#134c9c] rounded-full flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Security Check</h2>
                        </div>

                        <p className="text-gray-500 mb-6 leading-relaxed">
                            For your security, please enter your <strong className="text-gray-800">current password</strong> to confirm these changes.
                        </p>

                        <div className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="h-14 text-lg bg-gray-50"
                                autoFocus
                            />
                            {modalError && <p className="text-red-600 text-sm font-bold flex items-center gap-1"><AlertTriangle size={14} /> {modalError}</p>}

                            <Button
                                onClick={handleConfirmOldPassword}
                                disabled={isConfirmingPwd || currentPassword.length === 0}
                                className="w-full h-14 text-lg font-bold bg-[#134c9c] hover:bg-blue-800 shadow-md"
                            >
                                {isConfirmingPwd ? <Loader2 className="animate-spin" /> : "Confirm & Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto">
                {/* Antet Header */}
                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#134c9c] transition-colors mb-4">
                        <ArrowLeft size={16} strokeWidth={3} /> Return to Store
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Account</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                    {/* SIDEBAR NAVIGATION (Stanga) */}
                    <div className="w-full lg:w-80 flex-shrink-0 space-y-3 sticky top-28">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${activeTab === 'details' ? 'bg-[#134c9c] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-[#134c9c] border border-gray-100'}`}
                        >
                            <User size={24} /> My Profile
                        </button>

                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${activeTab === 'orders' ? 'bg-[#134c9c] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-[#134c9c] border border-gray-100'}`}
                        >
                            <Package size={24} /> Order History
                        </button>

                        <button
                            onClick={() => setActiveTab('addresses')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${activeTab === 'addresses' ? 'bg-[#134c9c] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-[#134c9c] border border-gray-100'}`}
                        >
                            <MapPin size={24} /> Saved Addresses
                        </button>

                        <div className="h-px bg-gray-200 my-6 mx-2"></div>

                        <button
                            onClick={() => { logout(); window.location.href = '/'; }}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg text-red-600 bg-white border border-red-100 hover:bg-red-50 transition-all"
                        >
                            <LogOut size={24} /> Log Out
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA (Dreapta) */}
                    <div className="flex-1 w-full min-w-0 bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-gray-100">

                        {/* TAB 1: MY PROFILE */}
                        {activeTab === 'details' && (
                            <div className="animate-in fade-in">
                                <h2 className="text-3xl font-black text-gray-900 mb-8">Personal Details</h2>

                                {profileMsg.text && (
                                    <div className={`p-5 mb-8 rounded-xl flex items-center gap-3 font-bold text-lg ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {profileMsg.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                                        {profileMsg.text}
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                                            <Input required value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className="h-14 text-lg bg-gray-50 border-gray-200" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                                            <Input required value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className="h-14 text-lg bg-gray-50 border-gray-200" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                            <Input disabled value={profileData.email} className="h-14 text-lg bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                            <Input value={profileData.phoneNumber} onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })} className="h-14 text-lg bg-gray-50 border-gray-200" />
                                        </div>
                                    </div>

                                    {/* Zona Schimbare Parola */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Security</h3>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                                            <Input
                                                type="password"
                                                placeholder="Leave blank to keep current password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="h-14 text-lg bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button type="submit" disabled={isUpdatingProfile} className="bg-[#134c9c] hover:bg-blue-800 h-14 px-12 text-lg font-bold rounded-xl shadow-lg">
                                            {isUpdatingProfile ? <Loader2 className="animate-spin" /> : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* TAB 2: ORDER HISTORY */}
                        {activeTab === 'orders' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-3xl font-black text-gray-900 mb-8">Order History</h2>

                                {orders.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <Package size={64} className="mx-auto text-gray-300 mb-6" />
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h3>
                                        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't made any purchases yet.</p>
                                        <Link to="/">
                                            <Button className="bg-[#134c9c] hover:bg-blue-800 h-14 px-10 text-lg font-bold rounded-xl">Start Shopping</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        {orders.map((order) => (
                                            <div key={order.id} className="rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

                                                {/* Header-ul Comenzii */}
                                                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Order Placed</p>
                                                        <p className="font-bold text-gray-900 text-lg">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Total Amount</p>
                                                        <p className="font-black text-[#134c9c] text-xl">{order.totalPrice.toFixed(2)} LEI</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Order ID</p>
                                                        <p className="font-bold text-gray-900 text-lg">#{order.id}</p>
                                                    </div>
                                                    <div className="flex md:justify-end">
                                                        <span className={`px-4 py-2 rounded-full text-xs font-black border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Lista de Produse (Cu Imagine) */}
                                                <div className="p-8">
                                                    <div className="space-y-6">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 last:pb-0">

                                                                <div className="flex items-center gap-6">
                                                                    {/* Poza cu Badge de Cantitate */}
                                                                    <div className="relative">
                                                                        <div className="w-20 h-20 bg-gray-50 rounded-full border border-gray-200 flex items-center justify-center  shrink-0">
                                                                            {item.imageUrl ? (
                                                                                <img src={item.imageUrl} alt={item.productName} className="w-full rounded-2xl h-full mix-blend-multiply" />
                                                                            ) : (
                                                                                <ShoppingBag size={28} className="text-gray-300" />
                                                                            )}
                                                                        </div>
                                                                        <div className="absolute -top-2 -right-2 bg-[#134c9c] text-white text-s font-bold w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                                                                            {item.quantity}
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <Link
                                                                            to={`/product/${item.productId}`}
                                                                            className="font-bold text-gray-900 text-lg mb-1 hover:text-[#80c4e8] transition-colors line-clamp-1"
                                                                        >
                                                                            {item.productName}
                                                                        </Link>
                                                                        <p className="text-gray-500 font-medium">{item.price.toFixed(2)} Lei / item</p>
                                                                    </div>
                                                                </div>

                                                                <div className="font-black text-gray-900 text-xl">
                                                                    {item.subTotal.toFixed(2)} LEI
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: SAVED ADDRESSES */}
                        {activeTab === 'addresses' && (
                            <div className="animate-in fade-in">
                                <h2 className="text-3xl font-black text-gray-900 mb-8">Saved Addresses</h2>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="p-8 rounded-3xl border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <p className="font-black text-gray-900 text-2xl">{addr.city}</p>
                                                    {addr.isDefaultDelivery && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-md uppercase font-black">Default</span>}
                                                </div>
                                                <p className="text-gray-600 text-lg leading-relaxed">{addr.street}</p>
                                                <p className="text-gray-400 mt-2 font-medium">{addr.zipCode}, {addr.country}</p>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                                {!addr.isDefaultDelivery ? (
                                                    <button onClick={() => handleSetDefaultAddress(addr)} className="font-bold text-[#134c9c] hover:text-blue-800 transition-colors">
                                                        Make Default
                                                    </button>
                                                ) : (
                                                    <span className="font-bold text-gray-400">Primary Address</span>
                                                )}

                                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-3 rounded-xl transition-colors" title="Delete Address">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {!showAddAddressForm && (
                                        <button
                                            onClick={() => setShowAddAddressForm(true)}
                                            className="min-h-[250px] rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-[#134c9c] hover:border-[#134c9c] hover:bg-blue-50 transition-all"
                                        >
                                            <Plus size={40} />
                                            <span className="font-bold text-xl">Add New Address</span>
                                        </button>
                                    )}
                                </div>

                                {showAddAddressForm && (
                                    <div className="mt-8 p-8 border border-blue-100 bg-blue-50/50 rounded-3xl relative">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3"><MapPin size={24} className="text-[#134c9c]" /> Add a New Address</h3>
                                        <form onSubmit={handleAddAddress} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Street</label>
                                                    <Input required value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} placeholder="Str. Principala 1" className="h-14 text-lg bg-white border-gray-200" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">City</label>
                                                    <Input required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="Bucharest" className="h-14 text-lg bg-white border-gray-200" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Postal Code</label>
                                                    <Input required value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} placeholder="012345" className="h-14 text-lg bg-white border-gray-200" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Country</label>
                                                    <Input required value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} disabled className="h-14 text-lg bg-gray-100 text-gray-500 border-gray-200" />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4 border-t border-gray-200/50">
                                                <Button type="submit" className="bg-[#134c9c] hover:bg-blue-800 h-14 px-10 text-lg font-bold rounded-xl shadow-lg">Save Address</Button>
                                                <Button type="button" variant="outline" onClick={() => setShowAddAddressForm(false)} className="h-14 px-10 text-lg font-bold rounded-xl bg-white">Cancel</Button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}