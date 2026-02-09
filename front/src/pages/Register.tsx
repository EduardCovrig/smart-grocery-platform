import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [serverError, setServerError] = useState<string | null>(null); // Aici se tine eroarea

    //validari de atingere campuri (pentru a afisa mesajele de eroare doar dupa ce utilizatorul a interactionat cu acel camp)
    const [touchedPassword, setTouchedPassword] = useState(false); // daca utilizatorul a scris parola, si dupa a apasat pe altceva
    const [touchedEmail, setTouchedEmail] = useState(false);
    const [touchedPhone, setTouchedPhone] = useState(false);


    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    //reguli de validare
    const isEmailValid = email.includes("@"); //sa aibe @ in el
    const isPhoneValid = phoneNumber.length === 10; // Fix 10 cifre
    const isPasswordValid = password.trim().length >= 8; //minim 8 caractere
    const passwordsMatch = password === confirmPassword; //sa fie la fel

    const isValid =
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        isEmailValid &&
        isPhoneValid &&
        isPasswordValid &&
        passwordsMatch;

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!passwordsMatch) {
            alert("Passwords do not match!");
            return;
        }
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            //keys neaparat sa fie EXACT ca în clasa Java (DTO-urile) pentru ca Spring sa poata face maparea automata.
            const payload =
            {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "phoneNumber": phoneNumber,
                "password": password
            }
            await axios.post(`${apiUrl}/auth/register`, payload);

            const loginResponse = await axios.post(`${apiUrl}/auth/login`, {
                email: email,
                password: password
            });
            console.log("Auto-login reusit! Token:", loginResponse.data);
            //aici se va salva tokenul ulterior.
            navigate("/");
        }
        catch (error: any) {
            console.error("Error registering user:", error);
            if (error.response && error.response.data) {
                // Backend-ul poate trimite string simplu sau obiect JSON
                const message = typeof error.response.data === 'string'
                    ? error.response.data
                    : error.response.data.message || "Something went wrong.";

                setServerError(message);
            } else {
                setServerError("Server not responding. Please try again later.");
            }
        }
        finally {
            setIsLoading(false);
        }
    }
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pb-20 pt-10">
        <Card className="w-full max-w-xl shadow-blue-300 shadow-md relative p-8">
            <Link to="/" className="absolute top-4 right-4 text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition rounded-full p-2">
                <X size={28} />
            </Link>

            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
                <CardDescription>Enter your details below to create your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">

                    {/* NUME SI PRENUME (GRID) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="Your first name" value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} required
                                className="h-12 hover:border-gray-500 transition-colors duration-300" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Your last name" value={lastName}
                                onChange={(e) => setLastName(e.target.value)} required
                                className="h-12 hover:border-gray-500 transition-colors duration-300" />
                        </div>
                    </div>
                    {/* EMAIL */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                            onBlur={() => setTouchedEmail(true)}
                            className={`h-12 transition-colors duration-300 ${touchedEmail && !isEmailValid
                                ? "border-red-500 focus-visible:ring-red-500"
                                : "hover:border-gray-500"
                                }`}
                        />
                        {/* mesaj de eroare */}
                        {touchedEmail && !isEmailValid && (
                            <p className="text-xs text-red-500">Please enter a valid email address (@).</p>
                        )}
                    </div>
                    {/* TELEFON */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" required placeholder="0712 345 678" value={phoneNumber}
                            onKeyDown={(e) => {
                                // Lista tastelor permise:
                                const allowedKeys = ["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight"];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onBlur={() => setTouchedPhone(true)}
                            className={`h-12 transition-colors duration-300 ${touchedPhone && !isPhoneValid
                                ? "border-red-500 focus-visible:ring-red-500"
                                : "hover:border-gray-500"
                                }`}
                        />
                        {/* mesaj de eroare */}
                        {touchedPhone && !isPhoneValid && (
                            <p className="text-xs text-red-500">Phone number must be exactly 10 digits.</p>
                        )}
                    </div>
                    {/* PAROLA */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Create a password (minimum 8 characters)" value={password} required
                            onChange={(e) => setPassword(e.target.value)}
                            className={`h-12 transition-colors duration-300 ${touchedPassword && password.length < 8
                                ? "border-red-500 focus-visible:ring-red-500" // EROARE
                                : "hover:border-gray-500" // NORMAL
                                }`}
                            onBlur={() => setTouchedPassword(true)} />

                        {/* mesaj de eroare */}
                        {touchedPassword && password.length < 8 && (
                            <p className="text-xs text-red-500">Password must be at least 8 characters long</p>)}
                    </div>

                    {/* CONFIRMARE PAROLA */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} required
                            className={`h-12 transition-colors duration-300 ${confirmPassword && !passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : "hover:border-gray-500"
                                }`} />
                        {/* mesaj de eroare */}
                        {confirmPassword && !passwordsMatch && (
                            <p className="text-xs text-red-500">Passwords do not match</p>
                        )}
                    </div>
                    {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    <Button disabled={!isValid || isLoading} type="submit" className={`w-full h-12 mt-4 transition-colors duration-200 ${isValid ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-8 animate-spin" />
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>

                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">Already have an account?
                    <Link to="/login" className="text-blue-600 hover:underline ml-1 font-normal">Login</Link>
                </p>
            </CardFooter>
        </Card>
    </div>
    )
}
