package covrig.eduard.project.Controllers;

import covrig.eduard.project.Services.BrandService;
import covrig.eduard.project.dtos.brand.BrandCreationDTO;
import covrig.eduard.project.dtos.brand.BrandResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/brands")
public class BrandController {
    private final BrandService brandService;
    public BrandController(BrandService brandService)
    {
        this.brandService=brandService;
    }
    @GetMapping
    public ResponseEntity<List<BrandResponseDTO>> getAllBrands()
    {
        return ResponseEntity.ok(brandService.getAllBrands());
    }
    @GetMapping("/{id}")
    public ResponseEntity<BrandResponseDTO> getBrandById(@PathVariable Long id)
    {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }
    @PostMapping
    public ResponseEntity<BrandResponseDTO> createBrand(@RequestBody @Valid BrandCreationDTO brandDTO)
    {
        return ResponseEntity.status(201).body(brandService.createBrand(brandDTO));
    }
    @PutMapping("/{id}")
    public ResponseEntity<BrandResponseDTO> updateBrand(@PathVariable Long id, @RequestBody @Valid BrandCreationDTO brandDTO)
    {
        return ResponseEntity.ok(brandService.updateBrand(id,brandDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<BrandResponseDTO> deleteBrand(@PathVariable Long id)
    {
        return ResponseEntity.ok(brandService.deleteBrand(id));
    }





}
