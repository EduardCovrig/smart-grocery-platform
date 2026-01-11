package covrig.eduard.project.Controllers;

import covrig.eduard.project.Services.CategoryService;
import covrig.eduard.project.dtos.category.CategoryCreationDTO;
import covrig.eduard.project.dtos.category.CategoryResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService)
    {
        this.categoryService=categoryService;
    }
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories()
    {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id)
    {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@RequestBody @Valid CategoryCreationDTO categoryDTO)
    {
        return ResponseEntity.status(201).body(categoryService.createCategory(categoryDTO));
    }
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryCreationDTO categoryDTO)
    {
        return ResponseEntity.ok(categoryService.updateCategory(id,categoryDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> deleteCategory(@PathVariable Long id)
    {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
