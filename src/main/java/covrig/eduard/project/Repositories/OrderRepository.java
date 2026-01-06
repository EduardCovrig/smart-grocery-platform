package covrig.eduard.project.Repositories;

import covrig.eduard.project.Models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findAllByUserId(Long id);
}
