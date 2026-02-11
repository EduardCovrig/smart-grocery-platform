import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom"; // Am adaugat Link
import axios from "axios";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State pentru imaginea selectata din galerie
    const [selectedImage, setSelectedImage] = useState<string>("");

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
                
                {/* BREADCRUMBS / NAVIGATION LINKS */}
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
                    
                    {/* COL #1: GALERIE FOTO */}
                    <div className="flex gap-4">
                        {/* 1. Lista de Thumbnail-uri (Stanga) */}
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

                        {/* 2. Imaginea Mare (Dreapta) */}
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
                                // AM SCOS hover:scale si transition-transform pentru efect static
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* COL #2: INFO PRODUS */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                {product.name}
                            </h1>
                            <div className="mt-2 text-sm text-gray-500">
                                Unit: {product.unitOfMeasure}
                            </div>
                        </div>

                        {/* PRET & BUTON */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
                            <div className="flex items-end gap-3">
                                <div className={`text-4xl font-black tracking-tighter ${product.hasActiveDiscount ? "text-red-600" : "text-gray-900"}`}>
                                    {product.currentPrice.toFixed(2)}
                                    <span className="text-lg font-bold ml-1">LEI</span>
                                </div>
                                {product.hasActiveDiscount && (
                                    <span className="text-sm text-gray-400 line-through mb-2">
                                        was {product.price.toFixed(2)} Lei
                                    </span>
                                )}
                            </div>

                            <Button 
                                onClick={() => addToCart(product.id, 1)}
                                className="w-full h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg flex items-center justify-center gap-2 shadow-sm"
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

                        {/* NUTRITIONAL VALUES (TABEL) */}
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