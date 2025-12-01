package covrig.eduard.project.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    // Prețul unitar final platit de client (dupa reduceri)
    @Column(name = "price", nullable = false)
    private Double price;

    // Prețul de bază la momentul achiziției
    @Column(name = "base_price", nullable = false)
    private Double basePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}