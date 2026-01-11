package covrig.eduard.project.mappers;

import covrig.eduard.project.Models.Brand;
import covrig.eduard.project.dtos.brand.BrandCreationDTO;
import covrig.eduard.project.dtos.brand.BrandResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponseDTO toDto(Brand b);
    List<BrandResponseDTO> toDtoList(List<Brand> brands);

    @Mapping(target="id", ignore=true)
    Brand toEntity(BrandCreationDTO b);
}
