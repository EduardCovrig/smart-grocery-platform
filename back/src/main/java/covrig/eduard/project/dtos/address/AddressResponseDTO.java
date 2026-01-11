package covrig.eduard.project.dtos.address;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponseDTO {
    private Long id;
    private String street;
    private String city;
    private String zipCode;
    private String country;
    private Boolean isDefaultDelivery;
}
