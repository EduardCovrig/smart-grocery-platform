import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { useState } from "react"
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const isValid = email.trim().length > 0 && password.trim().length > 0; // trim elimina space-urile de la inceput si sfarsit.
    const navigate = useNavigate();

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(`${apiUrl}/auth/login`,
                {
                    email: email,
                    password: password
                });
            console.log("Raspuns de la server:", response.data);
            // salvam tokenul ulterior
            navigate("/");
        }
        catch (error: any) {
            console.error("Eroare la login:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pb-60">
            <Card className="w-full max-w-lg shadow-blue-300 shadow-md relative p-8">
                <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition">
                    <X size={28} />
                </Link>
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold "> Welcome back!
                    </CardTitle>
                    <CardDescription>Please enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/*Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" value={email}
                                onChange={(e) => setEmail(e.target.value)} required className="h-12 hover:border-gray-500 transition-colors duration-300" />
                        </div>
                        {/*Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="Your password" value={password}
                                onChange={(e) => setPassword(e.target.value)} required className="h-12 hover:border-gray-500 transition-colors duration-300" />
                            <div className="flex justify-end">
                                <Link to="#" className="text-sm text-gray-400 hover:underline">Forgot password?</Link>
                            </div>
                        </div>
                        <Button disabled={!isValid || isLoading} type="submit" className={`w-full h-12 transition-colors duration-200 ${isValid ?
                                "bg-blue-400 hover:bg-blue-500 text-white"  //valid
                                : "bg-gray-200 text-gray-400 cursor-not-allowed" //invalid
                            }`}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-8 animate-spin" />
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>

                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">Don't have an account yet?
                        <Link to="/register" className="text-blue-600 hover:underline ml-1 font-normal">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}