package covrig.eduard.project.Services;

import covrig.eduard.project.Models.Cart;
import covrig.eduard.project.Models.CartItem;
import covrig.eduard.project.Models.Product;
import covrig.eduard.project.Models.User;
import covrig.eduard.project.Repositories.CartRepository;
import covrig.eduard.project.Repositories.ProductRepository;
import covrig.eduard.project.Repositories.UserRepository;
import covrig.eduard.project.dtos.cart.AddToCartDTO;
import covrig.eduard.project.dtos.cart.CartResponseDTO;
import covrig.eduard.project.mappers.CartMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional(readOnly = false)
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, CartMapper cartMapper, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.cartMapper = cartMapper;
        this.productRepository = productRepository;
    }


    //1. GET CART (sau creeaza in caz de nu exista)
    //fara readonly=true deoarece exista cazul in care cream un cart nou
    public CartResponseDTO getCartByUser(String userEmail)
    {
        User user=userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("Nu a fost gasit un user cu email-ul " + userEmail));
        Cart cart=cartRepository.findByUserId(user.getId()).orElseGet(() -> createNewCart(user));
        return cartMapper.toDto(cart);
    }
    private Cart createNewCart(User user)
    {
        Cart cart=new Cart();
        cart.setUser(user);
        cart.setItems(new ArrayList<>());
        return cart;
    }
    //2 ADD ITEMS TO CART
    public CartResponseDTO addToCart(String userEmail, AddToCartDTO dto)
    {
        //verificari validitate cerere adaugare
        User user=userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("Nu a fost gasit un user cu email-ul " + userEmail));
        Product productToAdd=productRepository.findById(dto.getProductId()).orElseThrow(() -> new RuntimeException("Nu a fost gasit produsul cu id-ul: " + dto.getProductId()));
        if(dto.getQuantity()>productToAdd.getStockQuantity())
            throw new RuntimeException("Stocul insuficient! Mai sunt doar " + productToAdd.getStockQuantity() + " produse");
        //final verificari validitate cerere

        Cart cart=cartRepository.findByUserId(user.getId()).orElseGet(() -> createNewCart(user)); //orElseGet e Lazy, orElse simplu nu e
        //deci la orElseGet se exectua doar daca se ajunge acolo, orElse ar executa mereu ce e in paranteze, degeaba
        //vedem daca e deja in cos aflat produsul
        Optional<CartItem> existingItem=cart.getItems().stream().filter(x -> x.getProduct().getId().equals(productToAdd.getId())).findFirst();
        if(existingItem.isPresent()) //item deja aflat in cos
        {
            CartItem item=existingItem.get();
            int newQuantity=item.getQuantity()+dto.getQuantity();

            // Re-verificam stocul total (cantitatea veche + cea noua)
            if (productToAdd.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Stoc insuficient pentru cantitatea totala (" + newQuantity + ").");
            }
            item.setQuantity(newQuantity);
        }
        //daca nu este deja aflat in cos
        else
        {
            CartItem newItem = new CartItem();
            newItem.setProduct(productToAdd);
            newItem.setCart(cart);
            newItem.setQuantity(dto.getQuantity());

            cart.getItems().add(newItem);
        }
//        Cart savedCart=cartRepository.save(cart);
//        return cartMapper.toDto(savedCart);
        //echivalent cu
        return cartMapper.toDto(cartRepository.save(cart));
    }

    //3. REMOVE ITEM
    public CartResponseDTO removeItemFromCart(String userEmail, Long cartItemId)
    {
        User user=userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("Nu a fost gasit un user cu email-ul " + userEmail));
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Nu a fos gasit niciun cos."));
        CartItem itemToRemove=cart.getItems().stream().filter(x -> x.getId().equals(cartItemId)).findFirst().orElseThrow(() -> new RuntimeException("Nu exista acest produs in cos!"));
        //daca ajunge pana aici fara nicio problema, il stergem.
        cart.getItems().remove(itemToRemove);
        return cartMapper.toDto(cartRepository.save(cart));
    }
    //4. CLEAR CART
    public CartResponseDTO clearCart(String userEmail)
    {
        User user=userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("Nu a fost gasit un user cu email-ul " + userEmail));
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Cosul este deja gol."));
        cart.getItems().clear();
        return cartMapper.toDto(cartRepository.save(cart));
    }
}
