import { useEffect, useState } from "react"
import axios from "axios"
import { Product } from "@/types"
import ProductCard from "@/components/ProductCard";
import { Loader2, SearchX, Store } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]); //lista de produse, initial goala
    const [isLoading, setIsLoading] = useState(true);        //initial se incarca
    const [error, setError] = useState<string | null>(null); //eroare, initial fara.

    const [searchParams]=useSearchParams(); //pentru a citi parametrii din url, ex ?category=, etc.
    const currentCategory=searchParams.get("category"); //extragerea categoriei din url, daca exista

    // State pentru sortare
    const [sortOrder, setSortOrder] = useState<string>("none");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL;
     
                let requestUrl=`${apiUrl}/products`;
                if(currentCategory) // daca s-a dat o categorie in url, adaugam la request
                {
                    requestUrl+=`/filter?category=${encodeURIComponent(currentCategory)}`;
                }
                const response = await axios.get(requestUrl);
                setProducts(response.data);
            }
            catch (err) {
                console.error(err);
                setError("It seems we can't load the products right now. Please try again later.");
            }
            finally { setIsLoading(false); }
        }
        fetchProducts();
    },[currentCategory]) //de fiecare data cand se schimba categoria din url

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={50} />
            </div>
        )

    }
    if (error) return (
        <div className="min-h-96 flex flex-col items-center justify-center text-gray-500 font-bold gap-y-14">
            <p className="text-9xl font-bold animate-spin"><Loader2 size={80}/></p>
            <p className="text-gray-500 text-4xl">{error}</p>
        </div>
    );

    // cazul in care backendul merge, dar nu avem produse.
    if(products.length===0)
    {
        return (
            <div className="min-h-[93vh] flex flex-col items-center text-center justify-center bg-gray-50">
                <div className="p-8 bg-white rounded-full mb-6 shadow-sm hover:bg-gray-800 transition-colors duration-400 group">
                    <SearchX size={64} className="text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <h1 className="font-black text-4xl text-gray-900 mb-5">
                    No products found!
                </h1>
               <div className="text-gray-500 mb-8 max-w-lg">
                    <p className="mb-0">It looks like we are currently out of stock for <strong className="text-[#134c9c]">{currentCategory}</strong>.</p>
                    <p>Try exploring other <strong className="text-[#1c7d1c]">fresh</strong> categories!</p>
                </div>
                <Link to='/'>
                    <Button className="h-12 px-8 rounded-full bg-[#134c9c] hover:bg-[#1e5cad] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-20">
                        <Store size={22} />
                        View all products
                    </Button>
                </Link>
                </div>
        )
    }
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
        </div>
        </div>  
    )
}