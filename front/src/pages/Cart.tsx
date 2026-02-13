import {useCart } from "@/context/CartContext"
import {Button} from "@/components/ui/button"
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ChefHat, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import calorieIcon from "@/assets/calorie.png";
import {X, Loader2} from "lucide-react" //pt modal

export default function Cart()
{
    {/* return <div className="px-10 text-2xl font-bold">Aici e cart-ul</div> */}

    const {cartItems, addToCart, fetchCart, removeFromCart}=useCart(); //extragere date din context
    const [isUpdating,setIsUpdating]=useState(false); //state local pentru a face butonul disabled in timpul 
    //unui request la server, ca sa nu se dea spam si sa se strice ceva.

    const [showIncrementModal, setShowIncrementModal] = useState(false);
    const [pendingItem, setPendingItem] = useState<any>(null); // Itemul la care vrem sa facem +1

    const totalPrice=cartItems.reduce((acc,item) => acc +item.subTotal,0);
    //pretul total din cos

    //FUNCTII AJUTATOARE
    

    const handleIncrement=async(productId: number)=> {
        const item=cartItems.find(x => x.productId===productId)
        if(!item) return;
        // VERIFICARE PRAG:
        const limit = item.nearExpiryQuantity || 0;

        //logica e ca modalul ar trebui sa se afiseze doar in cazul in care cantitatea+1 depaseste limita,
        //deci cantitatea actuala e egala cu limita. 
        //daca cantitatea e mai mare decat limita, nu e nevoie sa o gestionam pentru ca utilizatorul a fost deja informa
        if (item.quantity === limit && limit > 0) { //daca cantitatea actuala e egala cu limita si exista o limita
            setPendingItem(item); //itemul e setat ca urmeaza sa se modifice
            setShowIncrementModal(true); //afisam modalul
         return; 
         }
         //daca nu e cazul, adaugam cantitatea
        setIsUpdating(true);
        await addToCart(productId, 1);
        setIsUpdating(false);
    }
    const handleRemove=async(itemId: number) =>
    {
        await removeFromCart(itemId);
        //poate modal in viitor aici, acum mi-e lene
    }

    const confirmIncrement = async () => {
    if (!pendingItem) return;
    setIsUpdating(true); 
    await addToCart(pendingItem.productId, 1);
    setIsUpdating(false);

    setShowIncrementModal(false);
    setPendingItem(null);
};

    const formatUnit = (unit: string) => { //pt afisare pret / buc, litru, g, etc.
        const u = unit.toLowerCase();
        if (u === 'g' || u === 'gr' || u === 'gram') return '100g';
        if (u === 'ml') return '100ml';
        if (u === 'l' || u === 'litru') return 'Litru';
        if (u === 'buc' || u === 'bucata') return 'buc';
        return unit; // fallback in caz de nu respecta nimic
    };

    // Cos gol (varianta simpla de UI)
    if(cartItems.length===0)
    {
        return (
            <div className="min-h-[93vh] flex flex-col items-center justify-center text-center bg-gray-50">
                <div className="p-8 bg-white rounded-full mb-6 shadow-sm hover:bg-gray-800 transition-colors duration-400">
                    <ShoppingBag size={64} className="text-gray-300"/>
                </div>
                <h1 className="font-black text-4xl text-gray-900 mb-5">
                    Your cart is empty.
                </h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    It looks like you haven't added anything yet! Fill your cart by exploring our <strong className="text-[#80c4e8]">delicious</strong> and <strong className="text-[#278B27]">fresh</strong> groceries...
                </p>
                <Link to='/'>
                    <Button className="h-12 px-8 rounded-full bg-[#134c9c] hover:bg-[#1e5cad]
                    text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-20">
                        Search for your favourite groceries
                    </Button>
                </Link>
            </div>
        )
    }

    //cazul normal (TO DO)
    const sortedItems = [...cartItems].sort((a, b) => a.id - b.id); //sortare dupa id mai mare din cartitem

    return (
        <div className="min-h-[93vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 1. HEADER */}
                <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    Shopping Cart
                    <span className="text-lg font-medium text-gray-500 bg-white border-gray-200 px-3 py-1 rounded-full">{cartItems.length} items</span>
                </h1>
                {/* 2. Grid-ul Principal stanga: produse, dreapta: total */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/*COLOANA STANGA: LISTA PRODUSE */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* am folosit sortedItems pt ca inainte cand foloseam butoanele de + - se schimba
                        random ordinea la produse, asa ramane constanta */}
                        {sortedItems.map((item) => ( 
                            <div key={item.id} className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-shadow">
                                
                                {/* Imaginea produsului */}
                                <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#134c9c]">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                                    ) : (
                                        <ShoppingBag className="text-gray-300" size={32} /> //fall back iconita shoppingback daca nu gaseste url-ul
                                    )}
                                </div>

                                {/* B. Detalii produs  */}
                                <div className="flex-1 text-center sm:text-left w-full flex flex-col justify-center h-full">
                                    {/* Brand (mic, gri, uppercase) */}
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                        {item.brandName || "Generic Brand"}
                                    </div>

                                    {/* Nume Produs */}
                                    <h3 className="text-lg font-extrabold text-gray-900 leading-tight mb-2">
                                        {item.productName}
                                    </h3>

                                    {/* Zona Pret, Calorii */}
                                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                                        <div className="text-[#134c9c] font-black text-lg">
                                            {item.pricePerUnit.toFixed(2)} 
                                            <span className="text-sm font-bold text-gray-500 ml-1">
                                                Lei / {item.productUnit}
                                            </span>
                                        </div>

                                        {/* Calorii */}
                                        {item.calories && (
                                            <div className="bg-orange-50 text-orange-700 text-xs ml-2 font-bold px-2 py-1 rounded-md border border-orange-100 flex items-center gap-1">
                                                <img src={calorieIcon} alt="kcal" className="w-5 h-5 object-contain" />
                                                {item.calories}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* C. +,-,delete */}
                               <div className="flex items-center gap-6">
                                    <div className="flex items-center justify-between border border-gray-200 rounded-lg bg-gray-50 h-10 w-[140px]">
                                        <button disabled className="px-3 h-full text-gray-400 cursor-not-allowed border-r border-gray-200 flex items-center justify-center hover:bg-gray-100">
                                            <Minus size={14} />
                                        </button>
                                        
                                        {/* w-full pe text ca sa ocupe spatiul ramas */}
                                        <span className="flex-1 text-center font-bold text-gray-900 text-sm select-none">
                                            {item.quantity}
                                        </span>
                                        
                                        <button 
                                            onClick={() => handleIncrement(item.productId)}
                                            disabled={isUpdating}
                                            className="px-3 h-full text-blue-600 hover:bg-blue-100 transition-colors border-l border-gray-200 flex items-center justify-center"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="text-right min-w-[80px]">
                                        <p className="text-xl font-black text-gray-900">
                                            {item.subTotal.toFixed(2)} <span className="text-xs font-bold text-gray-500">LEI</span>
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => handleRemove(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                      </div>
                 </div>
    
                
            </div>
            {/* --- MODAL DE AVERTIZARE CRESTERE PRET --- */}
            {showIncrementModal && pendingItem && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-orange-100 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowIncrementModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Iconita */}
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
                                <AlertTriangle size={32} />
                            </div>
                            
                            <h3 className="text-xl font-black text-gray-900 mb-2">Price Change Alert</h3>
                            <p className="text-gray-600 mb-6">
                                You have claimed all <strong>{pendingItem.nearExpiryQuantity}</strong> reduced items for 
                                <span className="font-bold text-gray-900 mx-1">{pendingItem.productName}</span>.
                                <br/><br/>
                                This extra item will be added at the <strong className="text-[#134c9c]">full price</strong>.
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                                <Button 
                                    onClick={confirmIncrement} 
                                    className="w-full bg-[#134c9c] hover:bg-[#1e5cad] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" /> : "Okay, add at full price"}
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => setShowIncrementModal(false)} 
                                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 h-12 rounded-xl font-bold"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}