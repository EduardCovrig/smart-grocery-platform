import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import axios from "axios";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Loader2, ShieldCheck, AlertTriangle, Plus, Minus, Clock, CheckCircle2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetails() {
    const { id } = useParams();
    const { addToCart, cartItems } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>("");

    const [isAddingToCart,setIsAddingToCart]=useState(false)

    // 'reduced' = tab-ul cu produse la reducere
    // 'fresh' = tab-ul cu produse la pret intreg
    const [buyingMode, setBuyingMode] = useState<'reduced' | 'fresh'>('reduced');
    
    // State pentru Modalul de confirmare (Toast)
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Cantitatea selectata (resetata la 1)
    const [quantity, setQuantity] = useState(1);

    // ------------------------------------------

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                if (!id) return;
                
                const response = await axios.get(`${apiUrl}/products/${id}`);
                const productData = response.data;
                setProduct(productData);

                if (productData.imageUrls && productData.imageUrls.length > 0) {
                    setSelectedImage(productData.imageUrls[0]);
                } else {
                    setSelectedImage("https://placehold.co/600?text=No+Image");
                }
                
                // Daca nu are stoc redus, il fortam pe modul fresh
                if (!productData.nearExpiryQuantity || productData.nearExpiryQuantity === 0) {
                    setBuyingMode('fresh');
                }

            } catch (err) {
                console.error("Produs not found", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // --- LOGICA DE STOCURI ---
    const cartItem = cartItems.find(item => item.productId === product?.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;
    const totalAvailableStock = (product?.stockQuantity || 0) - quantityInCart;

    // Calculam stocurile separate
    const expiringStockTotal = product?.nearExpiryQuantity || 0;
    // Consideram ca 'expiringStock' e cat a mai ramas din totalul de reduse, presupunand ca cele din cos au luat prioritate.
    
    const freshStockTotal = (product?.stockQuantity || 0) - expiringStockTotal;
    
    // Logica Out of Stock pe variante
    const isReducedOutOfStock = expiringStockTotal <= 0 || totalAvailableStock <= 0;
    const isFreshOutOfStock = freshStockTotal <= 0 || totalAvailableStock <= 0;

    // Limita max pentru butonul +
    const maxQuantityForCurrentMode = buyingMode === 'reduced' 
        ? totalAvailableStock // La reduced poti selecta tot stocul, ca apoi sa te intrebe modalul
        : freshStockTotal; // La fresh nu poti selecta mai mult decat exista fresh

    // Resetam cantitatea cand schimbam tab-ul
    const handleTabChange = (mode: 'reduced' | 'fresh') => {
        setBuyingMode(mode);
        setQuantity(1);
    };

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleIncrease = () => {
        if (quantity < maxQuantityForCurrentMode) {
            setQuantity(prev => prev + 1);
        }
    };

    // --- HANDLER PRINCIPAL ADD TO CART ---
    const handleAddToCartClick = () => {
        if (!product) return;

        // Daca suntem pe Reduced si vrem mai mult decat exista redus -> modal de alegere
        if (buyingMode === 'reduced' && quantity > expiringStockTotal) {
            setShowConfirmModal(true);
        } else {
            // Caz normal (Fresh sau Reduced care se incadreaza in stoc)
            finalizeAddToCart(quantity);
        }
    };

    const finalizeAddToCart = async (qtyToAdd: number) => {
       if (!product) return;

        // 1. Activam loading-ul
        setIsAddingToCart(true);

        // 2. Asteptam 500ms (efect vizual)
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3. Facem actiunea reala
        await addToCart(product.id, qtyToAdd);
        
        // 4. Resetam starile
        setIsAddingToCart(false);
        setQuantity(1);
        setShowConfirmModal(false);
    };

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

    const hasExpiryStock = (product.nearExpiryQuantity || 0) > 0;

    return (
        <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
                
                {/* NAVIGATION */}
                <div className="mb-6 text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Link to="/" className="hover:text-[#80c4e8]">Home</Link>
                    <span>/</span>
                    <Link to={`/?category=${product.categoryName}`} className="hover:text-[#80c4e8] text-gray-900 font-bold uppercase">
                        {product.categoryName}
                    </Link>
                    <span>/</span>
                    <Link to={`/?brand=${product.brandName}`} className="hover:text-[#80c4e8] text-gray-900 font-bold uppercase">
                        {product.brandName}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* COL #1: GALERIE & NUTRITION */}
                    <div className="flex flex-col gap-10">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-3">
                                {product.imageUrls && product.imageUrls.map((url, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setSelectedImage(url)}
                                        className={`w-20 h-20 border rounded-lg overflow-hidden p-1 transition-all ${selectedImage === url ? "border-blue-600 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-400"}`}
                                    >
                                        <img src={url} alt={`Thumbnail ${index}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center h-[500px] relative overflow-hidden p-4">
                                {hasExpiryStock && (
                                    <div className="absolute top-4 left-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-md font-bold text-xs flex items-center gap-1 border border-orange-200 z-10">
                                        <Clock size={14} />
                                        Clearance Active
                                    </div>
                                )}
                                <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
                            </div>
                        </div>

                        {/* Nutritional Values */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Nutritional Values (100g):</h3>
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
                                <p className="text-gray-400 italic text-sm">Not available.</p>
                            )}
                        </div>
                    </div>

                    {/* COL #2: INFO & BUYING AREA */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
                            <Link className="hover:text-[#80c4e8]" to={`/?brand=${product.brandName}`}>{product.brandName}</Link>
                        </div>

                      {/* --- ZONA DE CUMPARARE DUALA --- */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
                            
                            {/* 1. TABS PENTRU SELECTIE MOD (Apar DOAR daca avem stoc pe duca) */}
                            {hasExpiryStock && (
                                <div className="flex bg-gray-200 p-1 rounded-lg mb-2">
                                    <button 
                                        onClick={() => handleTabChange('reduced')}
                                        disabled={isReducedOutOfStock}
                                        className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
                                            buyingMode === 'reduced' 
                                            ? "bg-white text-orange-600 shadow-sm" 
                                            : "text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                        }`}
                                    >
                                        <AlertTriangle size={16} />
                                        Reduced (Expiring)
                                    </button>
                                    <button 
                                        onClick={() => handleTabChange('fresh')}
                                        disabled={isFreshOutOfStock}
                                        className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
                                            buyingMode === 'fresh' 
                                            ? "bg-white text-blue-600 shadow-sm" 
                                            : "text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                        }`}
                                    >
                                        <CheckCircle2 size={16} />
                                        Full Price (Fresh)
                                    </button>
                                </div>
                            )}

                            {/* 2. PRET SI SELECTOR */}
                            <div className="flex items-end justify-between w-full">
                                {/* Zona Pret */}
                                <div>
                                    {/* LOGICA NOUA DE AFISARE PRET: 
                                        Afisam pretul redus daca:
                                        1. Suntem pe tab-ul 'reduced' (cazul expirare)
                                        SAU
                                        2. NU avem stoc de expirare (deci e reducere normala) SI produsul are reducere activa
                                    */}
                                    {(buyingMode === 'reduced' && product.hasActiveDiscount) || (!hasExpiryStock && product.hasActiveDiscount) ? (
                                        <>
                                            <div className={`text-4xl font-black tracking-tighter ${hasExpiryStock ? "text-orange-600" : "text-red-600"}`}>
                                                {product.currentPrice.toFixed(2)}<span className="text-lg font-bold ml-1">LEI</span>
                                            </div>
                                            <span className="text-sm text-gray-400 line-through">was {product.price.toFixed(2)} Lei</span>
                                            
                                            {/* Mesaj specific in functie de tipul reducerii */}
                                            {hasExpiryStock ? (
                                                <p className="text-xs text-orange-600 mt-1 font-bold">Expires soon!</p>
                                            ) : (
                                                <p className="text-xs text-red-600 mt-1 font-bold">Special Offer</p>
                                            )}
                                        </>
                                    ) : (
                                        /* CAZUL PRET INTREG (Fresh Tab sau Produs fara nicio reducere) */
                                        <>
                                            <div className="text-4xl font-black tracking-tighter text-gray-900">
                                                {product.price.toFixed(2)}<span className="text-lg font-bold ml-1">LEI</span>
                                            </div>
                                            {hasExpiryStock && <p className="text-xs text-blue-600 mt-1 font-bold">Guaranteed fresh.</p>}
                                        </>
                                    )}
                                </div>

                                {/* Selector Cantitate */}
                                <div className={`flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm ${(buyingMode === 'reduced' && isReducedOutOfStock) || (buyingMode === 'fresh' && isFreshOutOfStock) ? "opacity-50 pointer-events-none" : ""}`}>
                                    <button onClick={handleDecrease} disabled={quantity <= 1} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50">
                                        <Minus size={18} strokeWidth={3} />
                                    </button>
                                    <span className="text-xl font-bold w-8 text-center text-gray-800">{quantity}</span>
                                    <button onClick={handleIncrease} disabled={quantity >= maxQuantityForCurrentMode} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50">
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            {/* 3. BUTON ADD TO CART */}
                            <Button 
                                onClick={handleAddToCartClick}
                                disabled={(buyingMode === 'reduced' && isReducedOutOfStock) || (buyingMode === 'fresh' && isFreshOutOfStock) || isAddingToCart}
                                className={`w-full h-12 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-sm transition-all 
                                    ${(buyingMode === 'reduced' && isReducedOutOfStock) || (buyingMode === 'fresh' && isFreshOutOfStock)
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                                        : buyingMode === 'reduced' 
                                            ? "bg-orange-600 hover:bg-orange-700 text-white"
                                            : "bg-[#134c9c] hover:bg-[#80c4e8] hover:text-gray-800"
                                    }`}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBasket size={20} />
                                        {(buyingMode === 'reduced' && isReducedOutOfStock) || (buyingMode === 'fresh' && isFreshOutOfStock) 
                                            ? "OUT OF STOCK" 
                                            : hasExpiryStock 
                                                ? (buyingMode === 'reduced' ? "Add Reduced Items" : "Add Fresh Items")
                                                : "Add to Cart"
                                        }
                                    </>
                                )}
                            </Button>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Product Description</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{product.description || "No description available."}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg border border-green-100 text-sm font-medium">
                            <ShieldCheck size={18} />
                            <span>Quality Assured by EdwC Store</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL (TOAST) DE CONFIRMARE --- */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-orange-100 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setShowConfirmModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-600">
                                <AlertTriangle size={32} />
                            </div>
                            
                            <h3 className="text-xl font-black text-gray-900 mb-2">Partial Stock Available</h3>
                            <p className="text-gray-600 mb-6">
                                You requested <strong>{quantity}</strong> items, but only <strong>{expiringStockTotal}</strong> are available at the reduced price.
                                <br/><br/>
                                The remaining <strong>{quantity - expiringStockTotal}</strong> will be added at full price.
                            </p>

                            <div className="flex flex-col gap-3 w-full">
                               <Button 
                                    onClick={() => finalizeAddToCart(quantity)} 
                                    disabled={isAddingToCart} // Dezactivam cand incarca
                                    className="w-full bg-[#134c9c] hover:bg-[#1e5cad] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    {isAddingToCart ? <Loader2 className="animate-spin" /> : "Okay, Add All (Mixed Price)"}
                                </Button>
                               <Button 
                                    variant="outline"
                                    onClick={() => finalizeAddToCart(expiringStockTotal)} 
                                    disabled={isAddingToCart} // Dezactivam cand incarca
                                    className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    {isAddingToCart ? <Loader2 className="animate-spin" /> : `No, add only ${expiringStockTotal} reduced items`}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}