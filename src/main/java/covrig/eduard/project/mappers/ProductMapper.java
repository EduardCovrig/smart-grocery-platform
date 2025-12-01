package covrig.eduard.project.mappers;

import covrig.eduard.project.Models.Product;
import covrig.eduard.project.dtos.product.ProductCreationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import covrig.eduard.project.dtos.product.ProductResponseDTO;

import java.util.List;

@Mapper(componentModel="spring")
public interface ProductMapper {
    //MapStruct mapeaza automat campurile cu nume identice ca in tabela
    // (id,name,price,expirationDate,...)

    //facem manual mapping pt campurile cu nume diferite sau relatii.
    //astea doua mapping se aplica doar pt todto (mereu mapping puse se apllica pe prima functie precedata)
    //brand.name il cauta in Product, face .getbrand() si dupa .getname(), si il stocheaza in brandName din ProductResponsedto
    @Mapping(source="brand.name",target="brandName")
    @Mapping(source="category.name",target="categoryName")
    ProductResponseDTO toDto(Product product);

    //SURSA O REPREZINTA PRODUCTRESPOSNDTO, MAI JOS, PRODUCT, PRACTIC TIPUL RETURNAT

    //pe asta nu e niciun mapping pus
    List<ProductResponseDTO> toDtoList(List<Product> products);
    //functia este facuta in spate de MapStruct


    //CreationDTO
    @Mapping(target = "id", ignore = true) // ID-ul este generat de DB
    // Relatiile FK trebuie ignorate de MapStruct, le setam manual în Service
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductCreationDTO creationDTO);
    //nu facem list, pt ca la post se face un singur obiect
}
