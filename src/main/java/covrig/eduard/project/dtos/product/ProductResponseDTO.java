package covrig.eduard.project.dtos.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDTO {
    //FARA ADNOTARI @NOTNULL @NOTBLANK ETC SI ALTE VERIFICARI, DEOARECE DATELE 100% SUNT DEJA VALIDE,
    // DEOARECE DATELE VIN DEJA DIRECT DIN BAZA DE DATE
    private Long id;
    private String name;

    private Double price;
    private Integer stockQuantity;
    private String unitOfMeasure;
    private LocalDate expirationDate;

    private String brandName; //Product.brand.name
    private String categoryName; //Product.category.name
}
