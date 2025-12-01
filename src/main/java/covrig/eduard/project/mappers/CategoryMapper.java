package covrig.eduard.project.mappers;

import covrig.eduard.project.Models.Category;
import covrig.eduard.project.dtos.category.CategoryCreationDTO;
import covrig.eduard.project.dtos.category.CategoryResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponseDTO toDto(Category category);
    List<CategoryResponseDTO> toDtoList(List<Category> categories);

    @Mapping(target="id", ignore=true)
    Category toEntity(CategoryCreationDTO dto);
}
