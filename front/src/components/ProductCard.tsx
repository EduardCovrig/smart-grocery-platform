import { Product } from "@/types";
import { Link } from "react-router-dom";
import { ShoppingBasket } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageToDisplay = product.imageUrls?.[0] || "https://placehold.co/400?text=No+Image";
    const {addToCart}=useCart();

    const discountPercentage = product.hasActiveDiscount
        ? Math.round(((product.price - product.currentPrice) / product.price) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); //nu ne duce la productdetails (evenimentul default cand se apasa pe link)
        e.stopPropagation(); //nu transmite mai departe la parinti eventul

        addToCart(product.id, 1);
    };

    return (
        <Link 
            to={`/product/${product.id}`}
            className="group flex flex-col h-full bg-white rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/5 overflow-hidden relative border border-transparent"
        >
            {/* ZONA IMAGINE */}
            <div className="relative h-52 w-full p-4 flex items-center justify-center">
                {product.hasActiveDiscount && discountPercentage > 0 && (
                    <div className="absolute top-0 left-0 bg-[#e10d0d] text-white text-sm font-black px-4 py-2 rounded-br-2xl z-10">
                        -{discountPercentage}%
                    </div>
                )}
                <img 
                    src={imageToDisplay} 
                    alt={product.name} 
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" 
                />
            </div>

            {/* ZONA INFO */}
            <div className="flex flex-col flex-grow p-4 pt-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {product.brandName}
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 leading-tight line-clamp-2 mb-4 group-hover:text-[#134c9c]">
                    {product.name}
                </h3>

                {/* ZONA PRET */}
                <div className="mt-auto">
                    {product.hasActiveDiscount && (
                        <div className="text-sm text-gray-400 line-through font-medium mb-1">
                            {product.price.toFixed(2)} Lei
                        </div>
                    )}
                    <div className={`text-3xl font-black leading-none tracking-tighter ${product.hasActiveDiscount ? "text-[#e10d0d]" : "text-gray-900"}`}>
                        {product.currentPrice.toFixed(2)}
                        <span className="text-base font-bold ml-1 uppercase">Lei</span>
                    </div>
                </div>

                {/* BUTON ADAUGARE */}
                <div className="mt-6">
                    <Button 
                        onClick={handleAddToCart}
                        className="w-full h-12 rounded-xl bg-[#134c9c] text-white hover:bg-[#80c4e8] hover:text-[#134c9c] font-black text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-none border-none"
                    >
                        <ShoppingBasket size={22} strokeWidth={2.5} />
                        Add to cart
                    </Button>
                </div>
            </div>
        </Link>
    );
}