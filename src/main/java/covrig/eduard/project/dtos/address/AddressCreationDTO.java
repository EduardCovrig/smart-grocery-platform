package covrig.eduard.project.dtos.address;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Include @Getter, @Setter, @ToString, @EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class AddressCreationDTO {

    @NotBlank(message="Strada este oblgiatorie.")
    private String street;
    @NotBlank(message="Orasul este oblgiatorie.")
    private String city;
    @NotBlank(message="Codul postal este oblgiatorie.")
    private String zipCode;
    @NotBlank(message="Tara este obligatorie.")
    private String country;

    private Boolean isDefaultDelivery;

    //FK
    @NotNull(message = "ID-ul utilizatorului este obligatoriu.")
    private Long userId;
}
