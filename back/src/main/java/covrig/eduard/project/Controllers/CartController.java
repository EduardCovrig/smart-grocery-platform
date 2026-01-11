package covrig.eduard.project.Controllers;

import covrig.eduard.project.Services.CartService;
import covrig.eduard.project.dtos.cart.AddToCartDTO;
import covrig.eduard.project.dtos.cart.CartResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    //1. GET CART
    // URL: GET http://localhost:8080/api/cart
    // Header: Authorization: Bearer <token>
    @GetMapping()
    public ResponseEntity<CartResponseDTO> getMyCart(Authentication authentication)
    // Spring Security injecteaza automat userul logat in obiectul 'authentication'
    {
        String userEmail=authentication.getName(); //pt ca in user (parca) am setat ca pt noi numele utilizatorului este username-ul.
        //intr-o functie, ca nu avea sens sa mai facem si nume de utilizator
        return ResponseEntity.ok(cartService.getCartByUser(userEmail));
    }

    //2. ADD ITEM TO CART
    // URL: POST http://localhost:8080/api/cart/items
    // Body: { "productId": 1, "quantity": 5 }
    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addToCart(Authentication authentication, @RequestBody @Valid AddToCartDTO addToCartDTO)
    {
        String userEmail=authentication.getName();
        return ResponseEntity.ok(cartService.addToCart(userEmail,addToCartDTO));
    }

    // 3. REMOVE ITEM (Sterge un rand din cos)
    // URL: DELETE http://localhost:8080/api/cart/items/{cartItemId}
    // Folosim ID-ul randului din cos (CartItem.id), nu ID-ul produsului
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponseDTO> removeFromCart(Authentication authentication,@PathVariable Long cartItemId){
        String userEmail = authentication.getName();
        return ResponseEntity.ok(cartService.removeItemFromCart(userEmail, cartItemId));
    }

    // 4. CLEAR CART (Goleste tot cosul)
    //URL: DELETE http://localhost:8080/api/cart
    @DeleteMapping
    public ResponseEntity<CartResponseDTO> deleteCart(Authentication authentication)
    {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(cartService.clearCart(userEmail));
    }

}
