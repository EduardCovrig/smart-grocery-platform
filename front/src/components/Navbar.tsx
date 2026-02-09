import {Link, useLocation   } from "react-router-dom"
import {ShoppingCart, User, Search} from "lucide-react" //iconitele

export default function Navbar()
{
    const location=useLocation(); //pentru a afla pe ce pagina suntem acum.
    if(location.pathname==="/login" || location.pathname==="/register")
        return null;
    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        {/* ZONA 1: LOGO (Stanga) */}
        <Link to="/" className="text-2xl font-bold text-blue-700 hover:text-blue-900">
            EdwC Store
        </Link>
        {/* ZONA 2: SEARCH BAR (Centru) */}
        <div className="flex-1 max-w-xl mx-10 hidden md:flex relative "> {/* hidden pe ecranele mici, dar pe cele medii in sus se afiseaza flex */}
            <input type="text" placeholder="Search for your favorite products..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black bg-gray-50"/>
            <Search size={20} className="absolute left-3 top-2.5 text-gray-600"/>
        </div>
        {/* ZONA 3: User & Cart (Dreapta) */}
        <div className="flex items-center gap-6">
            {/* Buton User */}
            <Link to="/login" className="flex items-center gap-1 text-gray-600 hover:text-blue-700 font-medium">
            <User size={20}/>
                <span className="hidden sm:inline">My Account</span> {/* default hidden, insa incepand cu ecranele care se incadreaza
            in small se afiseaza ce e in inline adica My Account, lasa doar iconita */}
            </Link>
            {/* Buton Cos */}
            <Link to="/cart" className="relative bg-blue-50 p-2 text-blue-600 rounded-full hover:bg-blue-100 transition">
                <ShoppingCart size={20}/>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">0</span>
            </Link>

        </div>
        </nav>
    )
}