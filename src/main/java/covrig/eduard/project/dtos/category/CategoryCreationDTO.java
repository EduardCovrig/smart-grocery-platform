package covrig.eduard.project.dtos.category;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryCreationDTO {
    @NotBlank(message="Numele categoriei nu poate sa fie gol.")
    private String name;
}
