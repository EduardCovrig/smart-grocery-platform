package covrig.eduard.project.Services;

import covrig.eduard.project.Models.Brand;
import covrig.eduard.project.Models.Category;
import covrig.eduard.project.Models.Product;
import covrig.eduard.project.Repositories.BrandRepository;
import covrig.eduard.project.Repositories.CategoryRepository;
import covrig.eduard.project.Repositories.ProductRepository;
import covrig.eduard.project.dtos.product.ProductCreationDTO;
import covrig.eduard.project.dtos.product.ProductResponseDTO;
import covrig.eduard.project.mappers.ProductMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional //e necesar cand foloesc fetchtype.lazy pe models
//default readonly=false -> se foloseste default cu optiunile astea pentru toate metodele publice, daca nu se mentioneaza altfel cu o
//adnotare noua, cum e la primele 3 metode de tip GET.
public class ProductService {
    private final ProductRepository productRepository;
    //FINAL PE CAMP CAND FACI CU CONSTRUCTOR.
    //FARA FINAL, CAND FACI CU AUTOWIRED DIRECT PE EL
    private final ProductMapper productMapper;

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,ProductMapper productMapper,
                          BrandRepository brandRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.productMapper=productMapper;
        this.brandRepository=brandRepository;
        this.categoryRepository=categoryRepository;
    }


    //1. CITIRE
    @Transactional(readOnly=true) //optimizare performanta
    public List<ProductResponseDTO> getAllProducts()
    {
        List<Product> products=productRepository.findAll();
        return productMapper.toDtoList(products);
    }
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id)
    {
        Product productEntity=productRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Product not found with id: "+ id)
        );
        return productMapper.toDto(productEntity);
    }

    //filtrare produse care necesita discount (expira)
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsExpiringBefore(LocalDate date)
    {
        List<Product> products=productRepository.findByExpirationDateBefore(date);
        //nu e nevoie de .orelsethrow deoarece va returna o lista goala, e ok, nu e null.
        return productMapper.toDtoList(products);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByBrandName(String brandName) {
        List<Product> products = productRepository.findByBrandName(brandName);
        return productMapper.toDtoList(products);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByCategoryName(String categoryName) {
        List<Product> products = productRepository.findByCategoryName(categoryName);
        return productMapper.toDtoList(products);
    }

    // SCRIERE

    public ProductResponseDTO createProduct(ProductCreationDTO creationDTO)
    {
        Product productToSave=productMapper.toEntity(creationDTO);
        //mapeza campurile simple (name,price,stock,...)

        // TRATAREA FK -> cautam Brand-ul si categoria produsului, daca nu exita aruncam exceptie.
        Brand brand = brandRepository.findById(creationDTO.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + creationDTO.getBrandId()));
        Category category = categoryRepository.findById(creationDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + creationDTO.getCategoryId()));

        //daca le-a gasit, le setam in produs
        productToSave.setBrand(brand);
        productToSave.setCategory(category);

        // Postul efectiv in DB
        Product savedEntity=productRepository.save(productToSave);

        //returnam entitatea doar cu datele din DTO de raspuns catre controller
        return productMapper.toDto(savedEntity);
    }

    //UPDATE
    public ProductResponseDTO updateProduct(Long id, ProductCreationDTO updateDTO) {
        Product existingProduct = productRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Product not found for update with id: " + id)
        );
        //actualizam produsul existent, cu datele din DTO primit
        existingProduct.setName(updateDTO.getName());
        existingProduct.setPrice(updateDTO.getPrice());
        existingProduct.setStockQuantity(updateDTO.getStockQuantity());
        existingProduct.setUnitOfMeasure(updateDTO.getUnitOfMeasure());
        existingProduct.setExpirationDate(updateDTO.getExpirationDate());

       //actualizam relatiile FK

        //1. BRAND
        if(!existingProduct.getBrand().getId().equals(updateDTO.getBrandId()))
        {
            Brand newBrand = brandRepository.findById(updateDTO.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found with id: " + updateDTO.getBrandId()));
            //cauta noul brand, daca nu il gaseste arunca exceptie
            //daca il gaseste, ajunge pana aici si il seteaza in produsul existent
            existingProduct.setBrand(newBrand);
        }

        //2. CATEGORIE -> exact acelasi concept ca pt BRAND
        if (!existingProduct.getCategory().getId().equals(updateDTO.getCategoryId())) {
            Category newCategory = categoryRepository.findById(updateDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + updateDTO.getCategoryId()));
            existingProduct.setCategory(newCategory);
        }
        // aici are loc put-ul efectiv
        Product updatedEntity = productRepository.save(existingProduct);

        return productMapper.toDto(updatedEntity);
        //returnam un dto doar cu campurile pt result ca confirmare
    }



        //DELETE

        public ProductResponseDTO deleteProduct(Long id)
        {
            Product p=productRepository.findById(id).orElseThrow(
                    () -> new RuntimeException("Product not found with id: "+ id)
            );
            //aici are loc DELETE-UL efectiv
            productRepository.delete(p);
            return productMapper.toDto(p);
            //returnam entitatea stearsa ca confirmare ca dto

        }
    }



