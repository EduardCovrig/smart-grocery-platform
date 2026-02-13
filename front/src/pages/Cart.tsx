import {useCart } from "@/context/CartContext"
import {Button} from "@/components/ui/button"
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ChefHat } from "lucide-react";
import { useState, useEffect } from "react";

export default function Login()
{
    {/* return <div className="px-10 text-2xl font-bold">Aici e cart-ul</div> */}

    const {cartItems, addToCart, fetchCart, removeFromCart}=useCart();

}