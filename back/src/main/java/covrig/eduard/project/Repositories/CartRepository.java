package covrig.eduard.project.Repositories;

import covrig.eduard.project.Models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Long> {
    // Spring stie automat sa caute dupa User -> Id
    Optional<Cart> findByUserId(Long userId);

}
