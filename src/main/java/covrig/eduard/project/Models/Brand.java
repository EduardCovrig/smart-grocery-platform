package covrig.eduard.project.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "brand")
//@Data // Include @Getter, @Setter, @ToString, @EqualsAndHashCode
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
}
