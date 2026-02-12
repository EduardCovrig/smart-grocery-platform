import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom"; // Am adaugat Link
import axios from "axios";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Loader2, ShieldCheck, AlertTriangle, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart , cartItems} = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State pentru imaginea selectata din galerie
    const [selectedImage, setSelectedImage] = useState<string>("");


    // calcul cat mai putem adauga stoc - ce e in cos
    const cartItem = cartItems.find(item => item.productId === product?.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    
    // Stocul real disponiil pentru adaugare.
    const availableStock = (product?.stockQuantity || 0) - quantityInCart;
    //state pentru cantitatea produsului valabila pe site
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleIncrease = () => {
        // verificare stoc (daca produsul exista)
        if (product && quantity < availableStock) {
            setQuantity(prev => prev + 1);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                if (!id) return;
                
                const response = await axios.get(`${apiUrl}/products/${id}`);
                const productData = response.data;
                setProduct(productData);

                // Setam imaginea principala ca fiind prima din lista (sau placeholder)
                if (productData.imageUrls && productData.imageUrls.length > 0) {
                    setSelectedImage(productData.imageUrls[0]);
                } else {
                    setSelectedImage("https://placehold.co/600?text=No+Image");
                }

            } catch (err) {
                console.error("Produs not found", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
        );
    }

    if (!product) {
        return <Navigate to="/notfound" replace />;
    }

    const isExpiringSoon = product.hasActiveDiscount && product.discountType === "PERCENT";

    return (
        <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* NAVIGATION LINKS */}
                <div className="mb-6 text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Link to="/" className="hover:text-blue-600 hover:underline">Home</Link>
                    <span>/</span>
                    {/* Link catre filtrare dupa Categorie */}
                    <Link to={`/?category=${product.categoryName}`} className="hover:text-blue-600 hover:underline text-gray-900 font-bold uppercase">
                        {product.categoryName}
                    </Link>
                    <span>/</span>
                    {/* Link catre filtrare dupa Brand */}
                    <Link to={`/?brand=${product.brandName}`} className="hover:text-blue-600 hover:underline text-gray-900 font-bold uppercase">
                        {product.brandName}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* COL #1: GALERIE FOTO + Nutritional values */}
                    <div className="flex flex-col gap-10">
                        
                        {/* A. GALERIA */}
                        <div className="flex gap-4">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-3">
                                {product.imageUrls && product.imageUrls.map((url, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setSelectedImage(url)}
                                        className={`w-20 h-20 border rounded-lg overflow-hidden p-1 transition-all ${
                                            selectedImage === url 
                                            ? "border-blue-600 ring-1 ring-blue-600" 
                                            : "border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        <img 
                                            src={url} 
                                            alt={`Thumbnail ${index}`} 
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center h-[500px] relative overflow-hidden p-4">
                                {isExpiringSoon && (
                                    <div className="absolute top-4 left-4 bg-red-100 text-red-700 px-3 py-1 rounded-md font-bold text-xs flex items-center gap-1 border border-red-200 z-10">
                                        <AlertTriangle size={14} />
                                        Expiring Soon
                                    </div>
                                )}
                                <img 
                                    src={selectedImage} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* B. NUTRITIONAL VALUES (Mutat AICI) */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">
                                Nutritional Values (100g):
                            </h3>
                            
                            {product.attributes && Object.keys(product.attributes).length > 0 ? (
                                <div className="space-y-2">
                                    {Object.entries(product.attributes).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded">
                                            <span className="text-gray-600 font-medium capitalize">{key}</span>
                                            <span className="text-gray-900 font-bold">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic text-sm">Nutritional information not available.</p>
                            )}
                        </div>

                    </div>
                    {/* COL #2: INFO PRODUS */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                {product.name}
                            </h1>
                        </div>

                       {/* PRET & BUTON */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-6">
                            
                            {/* Container Flex pentru Pret (Stanga) si Selector (Dreapta) */}
                            <div className="flex items-end justify-between w-full">
                                
                                {/* Zona Pret */}
                                <div>
                                    <div className={`text-4xl font-black tracking-tighter ${product.hasActiveDiscount ? "text-red-600" : "text-gray-900"}`}>
                                        {product.currentPrice.toFixed(2)}
                                        <span className="text-lg font-bold ml-1 text-gray-600">LEI</span>
                                    </div>
                                    {product.hasActiveDiscount && (
                                        <span className="text-sm text-gray-400 line-through">
                                            was {product.price.toFixed(2)} Lei
                                        </span>
                                    )}
                                </div>

                                {/* Selector Cantitate (+ / -) */}
                                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                    
                                    {/* Buton Minus (Rosu Pal) */}
                                    <button 
                                        onClick={handleDecrease}
                                        disabled={quantity <= 1}
                                        className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <Minus size={18} strokeWidth={3} />
                                    </button>

                                    <span className="text-xl font-bold w-8 text-center text-gray-800">
                                        {quantity}
                                    </span>

                                    <button 
                                        onClick={handleIncrease}
                                        // dezactivare daca s-a atins limita de pe site
                                        disabled={quantity >= availableStock}
                                        className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            {/* Buton Add To Cart - Actualizat sa foloseasca 'quantity' */}
                            <Button 
                                onClick={() => addToCart(product.id, quantity)}
                                className="w-full h-12 rounded-lg bg-[#134c9c] text-white hover:bg-[#80c4e8] hover:text-[#134c9c] font-bold text-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <ShoppingBasket size={20} />
                                Add to Cart
                            </Button>
                        </div>
                        {/* DESCRIERE */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Product Description</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {product.description || "No description available."}
                            </p>
                        </div>


                        {/* Quality Badge */}
                        <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg border border-green-100 text-sm font-medium">
                            <ShieldCheck size={18} />
                            <span>Quality Assured by EdwC Store</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}