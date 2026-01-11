package covrig.eduard.project.Repositories;

import covrig.eduard.project.Models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    //momentan fara alte metode aici, poate adaug ulterior
}
