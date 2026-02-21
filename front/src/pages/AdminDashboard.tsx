import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    TrendingUp, 
    PackageOpen, 
    AlertTriangle, 
    ArrowLeft,
    Store,
    Search,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
}

interface OrderDetails {
    id: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
    userEmail?: string;
}

// --- MOCK DATA PENTRU GRAFICE ---
const dataWeek = [
    { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 }, { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 }, { name: 'Fri', sales: 6890 }, { name: 'Sat', sales: 8390 }, { name: 'Sun', sales: 7490 },
];
const dataMonth = [
    { name: 'Week 1', sales: 12500 }, { name: 'Week 2', sales: 15200 }, 
    { name: 'Week 3', sales: 18400 }, { name: 'Week 4', sales: 22100 },
];
const dataYear = [
    { name: 'Jan', sales: 45000 }, { name: 'Feb', sales: 52000 }, { name: 'Mar', sales: 48000 },
    { name: 'Apr', sales: 61000 }, { name: 'May', sales: 59000 }, { name: 'Jun', sales: 65000 },
    { name: 'Jul', sales: 71000 }, { name: 'Aug', sales: 68000 }, { name: 'Sep', sales: 75000 },
    { name: 'Oct', sales: 82000 }, { name: 'Nov', sales: 89000 }, { name: 'Dec', sales: 98000 },
];

export default function AdminDashboard() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, expiringProducts: 0 });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // State pentru Grafic (Filtru Timp)
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

    // Stari pentru managementul comenzilor
    const [searchOrderId, setSearchOrderId] = useState("");
    const [searchedOrder, setSearchedOrder] = useState<OrderDetails | null>(null);
    const [orderSearchError, setOrderSearchError] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    
    // Stari pentru actualizare status comanda
    const [newStatus, setNewStatus] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMsg, setUpdateMsg] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/orders/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                console.error("Eroare la preluarea statisticilor", err);
            } finally {
                setIsLoadingStats(false);
            }
        };

        if (user?.role === "ADMIN") fetchStats();
    }, [token, user]);

    // Cautare comanda
    const handleSearchOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchOrderId) return;

        setIsSearching(true);
        setOrderSearchError("");
        setSearchedOrder(null);
        setUpdateMsg("");

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/orders/${searchOrderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchedOrder(response.data);
            setNewStatus(response.data.status);
        } catch (err) {
            setOrderSearchError("Order not found or invalid ID.");
        } finally {
            setIsSearching(false);
        }
    };

    // Actualizare Status
    const handleUpdateStatus = async () => {
        if (!searchedOrder || !newStatus) return;
        setIsUpdating(true);
        setUpdateMsg("");
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            await axios.put(`${apiUrl}/orders/${searchedOrder.id}/status`, `"${newStatus}"`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setUpdateMsg("Status updated successfully!");
            setSearchedOrder({ ...searchedOrder, status: newStatus }); 
        } catch (err) {
            console.error(err);
            setOrderSearchError("Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Determina ce date afisam in grafic in functie de filtru
    const getChartData = () => {
        if (timeRange === 'month') return dataMonth;
        if (timeRange === 'year') return dataYear;
        return dataWeek;
    };

    const getChartTitle = () => {
        if (timeRange === 'month') return "Monthly Revenue";
        if (timeRange === 'year') return "Yearly Revenue";
        return "Weekly Revenue";
    };

    // Protejam ruta
    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    if (isLoadingStats) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={50}/></div>;

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMED': return 'bg-blue-100 text-[#134c9c] border-blue-200';
            case 'PROCESSING': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-[93vh] bg-gray-50 flex flex-col md:flex-row">
            {/* SIDEBAR ADMIN */}
            <div className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
                    <Store size={28} className="text-blue-400" />
                    <span className="font-black text-xl tracking-wider">ADMIN PANEL</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 font-bold transition-colors shadow-lg shadow-blue-900/50">
                    <LayoutDashboard size={20} /> Dashboard
                </div>
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-auto">
                    <ArrowLeft size={20} /> Exit to Store
                </Link>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Overview</h1>
                    <p className="text-gray-500">Welcome back, {user.firstName}. Here's what's happening today.</p>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Revenue</CardTitle>
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <TrendingUp size={20} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-gray-900">{stats.totalRevenue.toFixed(2)} Lei</div>
                            <p className="text-xs text-green-600 font-bold mt-2">+12% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Orders</CardTitle>
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <PackageOpen size={20} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-gray-900">{stats.totalOrders}</div>
                            <p className="text-xs text-gray-400 mt-2 font-medium">Orders placed successfully</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">Action Needed</CardTitle>
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-orange-600">{stats.expiringProducts}</div>
                            <p className="text-xs text-orange-600 font-bold mt-2">Products near expiration date</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* CHART */}
                    <Card className="border-none shadow-sm p-4 flex flex-col">
                        <CardHeader className="pb-0 mb-4">
                            <CardTitle className="text-xl font-black text-gray-900">{getChartTitle()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#134c9c" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#134c9c" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} Lei`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="sales" stroke="#134c9c" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                        {/* BUTOANE FILTRU TIMP (Aliniate in dreapta jos) */}
                        <div className="flex justify-end gap-2 mt-4 px-6 pb-2">
                            <Button 
                                variant={timeRange === 'week' ? 'default' : 'outline'} 
                                size="sm" 
                                onClick={() => setTimeRange('week')}
                                className={`rounded-full ${timeRange === 'week' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-slate-900'}`}
                            >
                                1 Week
                            </Button>
                            <Button 
                                variant={timeRange === 'month' ? 'default' : 'outline'} 
                                size="sm" 
                                onClick={() => setTimeRange('month')}
                                className={`rounded-full ${timeRange === 'month' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-slate-900'}`}
                            >
                                1 Month
                            </Button>
                            <Button 
                                variant={timeRange === 'year' ? 'default' : 'outline'} 
                                size="sm" 
                                onClick={() => setTimeRange('year')}
                                className={`rounded-full ${timeRange === 'year' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-slate-900'}`}
                            >
                                1 Year
                            </Button>
                        </div>
                    </Card>

                    {/* ORDER MANAGEMENT */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-gray-900">Order Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearchOrder} className="flex gap-2 mb-6">
                                <Input 
                                    type="number" 
                                    placeholder="Enter Order ID" 
                                    value={searchOrderId} 
                                    onChange={(e) => setSearchOrderId(e.target.value)} 
                                    className="h-12 bg-gray-50"
                                />
                                <Button type="submit" disabled={isSearching} className="h-12 px-6 bg-slate-900 hover:bg-slate-800">
                                    {isSearching ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                                </Button>
                            </form>

                            {orderSearchError && <p className="text-red-500 font-bold text-sm mb-4">{orderSearchError}</p>}
                            
                            {searchedOrder && (
                                <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm animate-in fade-in">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-black text-xl mb-1">Order #{searchedOrder.id}</h3>
                                            <p className="text-sm font-bold text-[#134c9c]">{searchedOrder.totalPrice.toFixed(2)} LEI</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(searchedOrder.status)}`}>
                                            {searchedOrder.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 mb-6">
                                        {searchedOrder.items.map((it, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-2">
                                                <span>{it.quantity}x {it.productName}</span>
                                                <span className="font-bold">{it.subTotal.toFixed(2)} Lei</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Update Status</label>
                                        <div className="flex gap-2">
                                            <Select value={newStatus} onValueChange={setNewStatus}>
                                                <SelectTrigger className="w-full h-12 bg-gray-50 font-bold border-gray-200">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                                                    <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                                                    <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                                                    <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                                                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button 
                                                onClick={handleUpdateStatus} 
                                                disabled={isUpdating || newStatus === searchedOrder.status}
                                                className="h-12 bg-green-600 hover:bg-green-700 font-bold px-6"
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin" /> : "Save"}
                                            </Button>
                                        </div>
                                    </div>
                                    {updateMsg && <p className="text-green-600 text-sm font-bold mt-3 flex items-center gap-1"><CheckCircle2 size={16}/> {updateMsg}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}