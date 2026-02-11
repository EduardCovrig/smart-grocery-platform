import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-10 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl text-blue-500 pt-10 py-2 font-black">404</h1>
            <p className="text-blue-500 text-2xl font-black">Page not found!</p>
            <p className="text-gray-400 font-black text-2xl mt-20 pb-5">It looks like the product you're searching for doesn't exist anymore! </p>
            <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-full">
                    Search for other food items
                </Button>
            </Link>

        </div>

    )
}