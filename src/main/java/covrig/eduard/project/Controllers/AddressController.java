package covrig.eduard.project.Controllers;

import covrig.eduard.project.Services.AddressService;
import covrig.eduard.project.dtos.address.AddressCreationDTO;
import covrig.eduard.project.dtos.address.AddressResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/addresses")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponseDTO>> getUserAddresses(@PathVariable("userId") Long id)
    {
        return ResponseEntity.ok(addressService.getUserAddresses(id));
    }
    @GetMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> getAddressById(@PathVariable Long id)
    {
        return ResponseEntity.ok(addressService.getAddressById(id));
    }
    @PostMapping
    public ResponseEntity<AddressResponseDTO> createAddress(@RequestBody @Valid AddressCreationDTO dto)
    {
        return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(addressService.createAddress(dto));
    }
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> updateAddress(@PathVariable Long id, @RequestBody @Valid AddressCreationDTO dto)
    {
        return ResponseEntity.ok(addressService.updateAddress(id,dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> deleteAddress(@PathVariable Long id)
    {
        return ResponseEntity.ok(addressService.deleteAddress(id));
    }

}
