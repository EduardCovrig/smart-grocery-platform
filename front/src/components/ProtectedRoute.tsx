import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import {Loader2} from "lucide-react"

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, token } = useAuth();

    //daca avem tokenul in memorie dar in timpul refreshului apare ca si cum nu ar fi logat (caz special)
    if (!isAuthenticated && token) {
        return (
        <div className="flex items-center justify-center h-screen w-full">
            <Loader2 size={50} className="animate-spin text-blue-500" />
        </div>
        )
    }

    // Daca nu e logat deloc (nici user, nici token), il trimitem la login
    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }

    // Daca totul e ok, afisam pagina
    return <>{children}</>;
};