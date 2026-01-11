package covrig.eduard.project.Services;

import covrig.eduard.project.Models.Category;
import covrig.eduard.project.Repositories.CategoryRepository;
import covrig.eduard.project.dtos.category.CategoryCreationDTO;
import covrig.eduard.project.dtos.category.CategoryResponseDTO;
import covrig.eduard.project.mappers.CategoryMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    public CategoryService(CategoryRepository cr,CategoryMapper cm) {
        categoryRepository = cr;
        categoryMapper=cm;
    }

    //1 READ.
    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAllCategories()
    {
        return categoryMapper.toDtoList(categoryRepository.findAll());
    }
    @Transactional(readOnly = true)
    public CategoryResponseDTO getCategoryById(Long id)
    {
        Category category=categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria cu id-ul: "+ id + " nu exista."));
        return categoryMapper.toDto(category);
    }

    //2. Metode de scriere
    public CategoryResponseDTO createCategory(CategoryCreationDTO creationDTO)
    {
        if(categoryRepository.existsByNameIgnoreCase(creationDTO.getName()))
            throw new RuntimeException("Categoria cu numele " + creationDTO.getName() + " exista deja.");
        Category categoryToSave=categoryMapper.toEntity(creationDTO); //aici id=null
        Category savedCategory=categoryRepository.save(categoryToSave); //acum are si id. dupa ce vine din baza de date
        return categoryMapper.toDto(savedCategory);
    }
    public CategoryResponseDTO updateCategory(Long id, CategoryCreationDTO creationDTO)
    {
        Category existingCategory=categoryRepository.findById(id).orElseThrow(( ) ->  new RuntimeException("Nu exista categoria cu id-ul " + id));

        if(categoryRepository.existsByNameIgnoreCase(creationDTO.getName())&&
        !existingCategory.getName().equalsIgnoreCase(creationDTO.getName())) //true daca numele actual != numele din dto
            throw new RuntimeException("Categoria cu numele " + creationDTO.getName() + " exista deja.");
        existingCategory.setName(creationDTO.getName());
        return categoryMapper.toDto(categoryRepository.save(existingCategory));
    }
    public CategoryResponseDTO deleteCategory(Long id)
    {
        Category category=categoryRepository.findById(id).orElseThrow( () -> new RuntimeException("Nu exista categoria cu id-ul " + id));
        categoryRepository.delete(category);
        return categoryMapper.toDto(category);
    }

}
