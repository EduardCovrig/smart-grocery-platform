package covrig.eduard.project.Repositories;

import covrig.eduard.project.Models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    public boolean existsByNameIgnoreCase(String name);

}
