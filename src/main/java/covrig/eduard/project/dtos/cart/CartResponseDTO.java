package covrig.eduard.project.dtos.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
    private Long id;
    private Long userId;
    private List<CartItemResponseDTO> items; //va cauta in cartMapper o metoda care transforma CartItem in CartItemResponseDTO,
    //pe care o va aplica recursiv pe lista. daca lasam List<Item> items, mappingul se facea automat, dar se expunea tot cartitemul,
    //ceea ce nu voiam.
    private Double totalPrice;
}
