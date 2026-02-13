import {useCart } from "@/context/CartContext"
import {Button} from "@/components/ui/button"
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";

export default function Login()
{
    {/* return <div className="px-10 text-2xl font-bold">Aici e cart-ul</div> */}

    const {cartItems, addToCart, fetchCart, removeFromCart}=useCart(); //extragere date din context
    const [isUpdating,setIsUpdating]=useState(false); //state local pentru a face butonul disabled in timpul 
    //unui request la server, ca sa nu se dea spam si sa se strice ceva.

    const totalPrice=cartItems.reduce((acc,item) => acc +item.subTotal,0);
    //pretul total din cos

    //FUNCTII AJUTATOARE

    const handleIncrement=async(productId: number)=> {
        setIsUpdating(true);
        await addToCart(productId,1);
        setIsUpdating(false);
    }

    
    const handleRemove=async(itemId: number) =>
    {
        await removeFromCart(itemId);
        //poate modal in viitor aici, acum mi-e lene
    }

    // Cos gol (varianta simpla de UI)
    if(cartItems.length===0)
    {
        return (
            <div className="min-h-[72vh] flex flex-col items-center justify-center text-center px-10 bg-gray-50">
                <div className="p-8 bg-white rounded-full mb-6 shadow-sm">
                    <ShoppingBag size={64} className="text-gray-300"/>
                </div>
                <h1 className="font-black text-4xl text-gray-900 mb-5">
                    Your cart is empty.
                </h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    It looks like you haven't added anything yet! Fill your cart by exploring our <strong>delicious </strong>and <strong>fresh</strong> groceries...
                </p>
                <Link to='/'>
                    <Button className="h-12 px-8 rounded-full bg-[#134c9c] hover:bg-[#1e5cad]
                    text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                        Search for your favourite groceries
                    </Button>
                </Link>
            </div>
        )
    }

    //cazul normal (TO DO)

}