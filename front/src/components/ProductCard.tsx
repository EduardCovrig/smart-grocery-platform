import Product from "@/types";
import {Link} from "react-router-dom";
import {ShoppingCart} from "lucide-react";
import {Button} from "./ui/button"

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({product}: ProductCardProps)
{
    const imageToDisplay=product.imageUrls&& product.imageUrls.length>0 ?
        product.imageUrls[0] : "https://placehold.co/400?text=No+Image";

    return (
        <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col h-full">
            <Link to={`/product/${product.id}`} className="h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden relative">
            {/* overflow hidden ca sa nu depaseasca colturile rontunjite */}
               <img src={imageToDisplay} alt={product.name} className="object-contain h-full w-full hover: scale-105 transition-transform duration-300"/>
            </Link>
            {product.hasActiveDiscount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SALE
                    </span>
                )}

            {/* Zona Informatii */}
            <div className="flex flex-col flex-grow">
                    <span className="text-xs text-gray-500 uppercase font-semibold">{product.brandName}</span> {/* daca puneam fara {}, scria efectiv textul product.brandName */}
                    {/* uppercase e mai rapid decat .toUpperCase() pe variabila, deoarece nu face nicio schimbare interna, doar afiseaza diferit pe site*/}
                <h3 className="font-bold text-lg text-gray-800 leading-tight mb-2 line-clamp-2"> {/* line-clamp-2 -> daca textul e mai lung de 2 randuri, pune ... in continuare */}
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        {/* Pretul vechi (taiat) - apare doar daca e reducere */}
                        {product.hasActiveDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                {product.price} RON
                            </span>
                        )}
                        {/* Pretul curent (mare) */}
                        <span className="text-xl font-bold text-blue-600">
                            {product.currentPrice} RON
                        </span>
                    </div>

                    <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700">
                        <ShoppingCart size={18} className="text-white" />
                    </Button>
                </div>
            </div>
        </div>
    )
}