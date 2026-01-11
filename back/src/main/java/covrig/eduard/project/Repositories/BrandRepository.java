package covrig.eduard.project.Repositories;

import covrig.eduard.project.Models.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand,Long> {
    public boolean existsByNameIgnoringCase(String name);
}
