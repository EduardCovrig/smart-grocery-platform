package covrig.eduard.project.dtos.brand;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data // Include @Getter, @Setter, @ToString, @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class BrandCreationDTO {
    @NotBlank(message="Numele brand-ului este obligatoriu")
    private String name;
}
