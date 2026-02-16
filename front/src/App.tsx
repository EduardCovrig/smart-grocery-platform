import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import { ProtectedRoute } from "./components/ProtectedRoute"
import NotFound from "./pages/NotFound"
import ProductDetails from "./pages/ProductDetails"
import Checkout from "./pages/Checkout"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>} />

       {/* path="*" -> "Orice altceva, to do later ruta de catch all" - DONE */}
      <Route path='*' element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
        )
}

export default App  