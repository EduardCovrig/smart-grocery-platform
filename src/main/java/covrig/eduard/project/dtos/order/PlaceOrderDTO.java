package covrig.eduard.project.dtos.order;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderDTO {
    @NotNull(message = "Adresa de livrare este obligatorie.")
    private Long addressId;

}
