package covrig.eduard.project.Services;

import covrig.eduard.project.Models.Brand;
import covrig.eduard.project.Repositories.BrandRepository;
import covrig.eduard.project.dtos.brand.BrandCreationDTO;
import covrig.eduard.project.dtos.brand.BrandResponseDTO;
import covrig.eduard.project.mappers.BrandMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BrandService {
    final private BrandRepository brandRepository;
    private final BrandMapper brandMapper; //recomandat ca private sa fie primul (identificatorul de accs)
    public BrandService(BrandRepository br,BrandMapper bm) {
        brandRepository = br;
        brandMapper=bm;
    }

    //1. metode de citire (READ)

    @Transactional(readOnly = true)
    public List<BrandResponseDTO> getAllBrands()
    {
        return brandMapper.toDtoList(brandRepository.findAll());
    }
    @Transactional(readOnly=true)
    public BrandResponseDTO getBrandById(Long id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() ->

            new RuntimeException("Brand not found with id: "+ id)
        );
        return brandMapper.toDto(brand);
    }

    //2. metode de scriere (WRITE)
    public BrandResponseDTO createBrand(BrandCreationDTO dto)
    {
        if(brandRepository.existsByNameIgnoringCase(dto.getName()))
        {
            throw new RuntimeException("Brand-ul cu numele: "+ dto.getName() + " exista deja.");
        }
        Brand brandToSave=brandMapper.toEntity(dto); //aici id e null
        Brand savedBrand=brandRepository.save(brandToSave); //aici ia id din baza e date
        return brandMapper.toDto(savedBrand);
    }
    public BrandResponseDTO updateBrand(Long id, BrandCreationDTO dto)
    {
        Brand existingBrand=brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Nu s-a gasit brand-ul cu id-ul "+ id));
        if(brandRepository.existsByNameIgnoringCase((dto.getName()))&&
        !existingBrand.getName().equalsIgnoreCase(dto.getName()))
        {
            throw new RuntimeException("Brand-ul cu numele "+ dto.getName()+ " exista deja.");
        }
        existingBrand.setName(dto.getName());
        return brandMapper.toDto(brandRepository.save(existingBrand)); //.save returneaza mereu la final obiectul salvat.
        //deci practic intai se executa salvarea, si dupa se returneaza obiectul catre todto, care apoi face mappingul catre brandresponse
    }
    public BrandResponseDTO deleteBrand(Long id)
    {
        Brand brand=brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Nu s-a gasit brand-ul cu id-ul "+ id));
        brandRepository.delete(brand);
        return brandMapper.toDto(brand);
    }


}
