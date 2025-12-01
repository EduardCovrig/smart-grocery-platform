package covrig.eduard.project.Models;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "discount")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Valoarea reducerii (procent sau sumă fixă)
    @Column(name = "discount_value")
    private Double discountValue;

    // Tipul reducerii ('PERCENT' sau 'FIXED')
    @Column(name = "discount_type", nullable = false)
    private String discountType;

    @Column(name = "discount_start_date")
    private Instant discountStartDate;

    @Column(name = "discount_end_date")
    private Instant discountEndDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
