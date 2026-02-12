import { Link, useLocation, useNavigate } from "react-router-dom"
import { ShoppingCart, User, Search, LogOut } from "lucide-react" //iconitele
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {useState,useEffect} from "react"
import { Button } from "./ui/button";

export default function Navbar() {
    const location = useLocation(); //pentru a afla pe ce pagina suntem acum.
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const [isBumping, setIsBumping] = useState(false); //state animatie bulina rosie cart
    useEffect(() => {
        if (cartCount === 0) return; // Nu animam la incarcarea initiala daca e 0

        setIsBumping(true); // 1. Pornim animatia

        // 2. stop dupa 0.3s
        const timer = setTimeout(() => {
            setIsBumping(false);
        }, 400);

        return () => clearTimeout(timer); 
    }, [cartCount]);

    // --- LOGICA DE AFISARE NUME ---
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim(); // Numele complet
    // Daca lungimea totala > 15 caractere, afiseaza doar prenumele. Altfel, afiseaza numele complet.
    const displayName = fullName.length > 15 ? firstName : fullName;

    // Functie wrapper pentru logout ca sa redirectioneze pe pagina principala ulterior
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    /// Ascunde Navbar pe Login/Register
    if (location.pathname === "/login" || location.pathname === "/register")
        return null;
    return (
        <nav className="relative flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
            {/* ZONA 1: LOGO (Stanga) */}
            <div className="z-10">
                <Link to="/" className="text-2xl font-bold text-[#134c9c] hover:text-blue-900">
                    EdwC Store
                </Link>
            </div>
            {/* ZONA 2: SEARCH BAR (Centru) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-4"> {/* hidden pe ecranele mici, dar pe cele medii in sus se afiseaza flex */}
                <div className="relative w-full">
                    <input type="text" placeholder="Search for your favorite products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black bg-gray-50" />
                    <Search size={20} className="absolute left-3 top-2.5 text-gray-600" />
                </div>
            </div>
            {/* ZONA 3: User & Cart (Dreapta) */}
            <div className="flex items-center gap-6 z-10">
                {/* Buton User */}
                {isAuthenticated ? (
                   <div className="flex items-center gap-3 pl-3 pr-1 py-1 bg-gray-100 rounded-full border border-gray-200">
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-gray-500" />
                            <span 
                                className="text-sm font-medium text-gray-700 whitespace-nowrap"
                                title={fullName} 
                            >
                                {displayName}
                            </span>
                        </div>
                        <Button 
                            variant="ghost"
                            size="lg" 
                            onClick={handleLogout} 
                            className="h-7 w-max max-w-lg px-2 rounded-full hover:bg-white hover:text-red-600 transition-all text-gray-400"
                            title="Log out"
                        >
                            <LogOut /> Log Out
                        </Button>
                    </div>
                ) : (
                    <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-blue-700 font-medium transition">
                        <User size={20} />
                        <span className="hidden sm:inline">Log in</span>
                    </Link>
                )}
                {/* Buton Cos */}
                <Link to="/cart" className="relative bg-blue-50 p-2 text-blue-600 rounded-full hover:bg-blue-100 transition">
                    <ShoppingCart size={20} />
                   {cartCount > 0 && (
                     <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex 
                     items-center justify-center rounded-full transition-transform duration-200 ease-in-out ${isBumping ? "scale-150" : "scale-100"}`}>
                        {cartCount}
                    </span>
                   )}
                </Link>

            </div>
        </nav>
    )
}