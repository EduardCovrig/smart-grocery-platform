package covrig.eduard.project.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_attribute", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"product_id", "name", "value"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name; // Ex: 'Dieta', 'Alergeni'

    @Column(name = "value", nullable = false)
    private String value; // Ex: 'Vegan', 'Fara Gluten'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}