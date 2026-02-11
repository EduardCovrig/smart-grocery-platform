import { useEffect, useState } from "react"
import axios from "axios"
import { Product } from "@/types"
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]); //lista de produse, initial goala
    const [isLoading, setIsLoading] = useState(true);        //initial se incarca
    const [error, setError] = useState<string | null>(null); //eroare, initial fara.

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/products`);
                setProducts(response.data);
            }
            catch (err) {
                console.error(err);
                setError("Error receivng data from backend. Is the backend api working?");
            }
            finally { setIsLoading(false); }
        }
        fetchProducts();
    }, []) //doar la mount

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={50} />
            </div>
        )

    }
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-red-500 gap-4">
            <p className="text-xl font-bold">Ooops!</p>
            <p>{error}</p>
        </div>
    );
    return (
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Fresh Products, made just for you!
                </h1>
                <p className="text-lg text-gray-500 mt-2">
                    Quality assured by our local producers.
                </p>
            </div>
            <div className="max-w-[1600px] mx-auto px-2 py-8">
                <h2 className="text-3xl font-black text-blue-900 mb-8 tracking-tight">Best Offers</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
            {/* cazul in care backendul merge, dar nu avem produse */}
            {products.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">We are out of these types of products. Try searching for something else.</p>
                </div>
            )}

        </div>
        </div>  
    )
}