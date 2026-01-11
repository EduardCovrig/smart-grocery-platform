package covrig.eduard.project.Repositories;

import covrig.eduard.project.Models.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Long> {
    List<Address> findAllByUserId(Long userId); //numele parametrului poate fi orice
    //nu il facem optional deoarece lista poate fi goala fara niciun fel de problema
}
