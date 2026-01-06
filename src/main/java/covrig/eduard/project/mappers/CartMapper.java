package covrig.eduard.project.mappers;

import covrig.eduard.project.Models.Cart;
import covrig.eduard.project.Models.CartItem;
import covrig.eduard.project.dtos.cart.CartItemResponseDTO;
import covrig.eduard.project.dtos.cart.CartResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper {
    // Mapare cart -> dto
    @Mapping(source="user.id",target = "userId") //(userId=cart.getUser()).getId(), iar userId este in CartResponseDTO
    @Mapping(target = "totalPrice", expression = "java(calculateTotalPrice(cart))")
    CartResponseDTO toDto(Cart cart);


    //Mapare CartItem -> dto
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.unitOfMeasure", target = "productUnit")
    @Mapping(source = "product.price", target = "pricePerUnit")
    @Mapping(target = "subTotal", expression = "java(calculateSubTotal(item))")
    CartItemResponseDTO toItemDto(CartItem item);
    //metoda asta se foloseste automat de catre spring in toDto de mai sus ca sa transforme fiecare cartItem in CartItemResponseDTO
    //pentru lista de iteme ( spring cauta automat o metoda in mapper de forma "CartItemresponse DTO ... (CartItem ...)"




    //metodele pentru calculele din expresii
    default Double calculateSubTotal(CartItem item) {
        if (item.getProduct() == null) return 0d;
        return item.getProduct().getPrice() * item.getQuantity();
    }

    default Double calculateTotalPrice(Cart cart) {
        if (cart.getItems() == null) return 0d;
        return cart.getItems().stream()
                .mapToDouble(this::calculateSubTotal)
                .sum();
    }
}
