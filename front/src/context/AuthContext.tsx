import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// ce are un utilizator
interface User {
    sub: string; // sub e emailul, subject (standard JWT)
    firstName: string;
    lastName: string;
    role: string;
    exp: number; // data expirarii token-ului
}

// Ce ofera AuthContext-ul
interface AuthContextType {
    user: User | null;          // Datele utilizatorului sau null daca nu e logat
    token: string | null;       // Token-ul JWT brut
    login: (token: string) => void; // Functia de login
    logout: () => void;         // Functia de logout
    isAuthenticated: boolean;   // E logat sau nu?
}

// Crearea contextului
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider-ul care va inveli aplicatia si va oferi datele de autentificare
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(null);

    // FUNCTIA 1: VERIFICARE INITIALA (La refresh)
    useEffect(() => {
        if (token) {
            try {
                // Incercam sa decodam token-ul existent
                const decodedUser = jwtDecode<User>(token);
                
                // Verificam daca a expirat
                const isExpired = decodedUser.exp * 1000 < Date.now();
                
                if (isExpired) {
                    logout(); // Daca a expirat, il dam afara
                } else {
                    setUser(decodedUser); // Daca e bun, setam userul
                }
            } catch (error) {
                console.error("Token invalid:", error);
                logout();
            }
        }
    },[token]);

    // FUNCTIA 2: LOGIN (Se apeleaza cand primim token de la Java)
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken); // 1. Salvam in browser (Persistent)
        setToken(newToken);                      // 2. Salvam in State (React)
        // useEffect-ul de mai sus va rula automat pt ca se schimba token-ul, si useEffect-ul are ca parametru [token]
        // si va decoda userul
    };

    // FUNCTIA 3: LOGOUT
    const logout = () => {
        localStorage.removeItem("token"); // Stergem din browser
        setToken(null);                   // Stergem din State
        setUser(null);                    // Stergem datele userului
    };

    const isAuthenticated = !!user; // true daca user != null (!(!user)) -> inverseaza rezultatul rezultatului
    //user==null => !user=true => !(true)=false

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook ca sa folosim contextul mai usor in alte fisiere
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth needs to be used within an AuthProvider");
    return context;
};