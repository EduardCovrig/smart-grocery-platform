package covrig.eduard.project.Services;

import covrig.eduard.project.Models.Address;
import covrig.eduard.project.Models.User;
import covrig.eduard.project.Repositories.AddressRepository;
import covrig.eduard.project.Repositories.UserRepository;
import covrig.eduard.project.dtos.address.AddressCreationDTO;
import covrig.eduard.project.dtos.address.AddressResponseDTO;
import covrig.eduard.project.mappers.AddressMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, AddressMapper addressMapper, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
        this.userRepository = userRepository;
    }

    // READ
    @Transactional(readOnly = true)
    public List<AddressResponseDTO> getUserAddresses(Long userId)
    {
        if(!userRepository.existsById(userId))
            throw new RuntimeException("Nu exista utilizatorul cu id-ul: "+ userId + ".");
        List<Address> addresses=addressRepository.findAllByUserId(userId);
        return addressMapper.toDtoList(addresses);
    }
    @Transactional(readOnly=true)
    public AddressResponseDTO getAddressById(Long id)
    {
        Address address=addressRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Utilizatorul cu id-ul "+ id + " nu are adrese salvate."));
        return addressMapper.toDto(address);
    }

    // CREATE
    public AddressResponseDTO createAddress(AddressCreationDTO dto)
    {
        User user=userRepository.findById(dto.getUserId()).orElseThrow(() ->
                new RuntimeException("Nu exista utilizatorul cu id-ul: "+ dto.getUserId() + "."));
        //deselectare fosta adresa default daca noua adresa e setata ca default
        if(Boolean.TRUE.equals(dto.getIsDefaultDelivery()))
            unsetOldDefaultAddress(user.getId());
        Address addressToSave= addressMapper.toEntity(dto);
        addressToSave.setUser(user);
        return addressMapper.toDto(addressRepository.save(addressToSave));
    }
    // UPDATE
    public AddressResponseDTO updateAddress(Long id,AddressCreationDTO dto)
    {
        Address address=addressRepository.findById(id).orElseThrow(() ->
            new RuntimeException("Adresa cu id-ul "+ id + " nu a fost gasita.")
        );
        if(Boolean.TRUE.equals(dto.getIsDefaultDelivery()))
            unsetOldDefaultAddress(address.getUser().getId());

        //actualizam ce e de actualizat
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setZipCode(dto.getZipCode());
        address.setCountry(dto.getCountry());
        address.setIsDefaultDelivery(dto.getIsDefaultDelivery());
        //fara user, pt ca nu avem voie sa schimbam id-ul utilizatorului
        return addressMapper.toDto(addressRepository.save(address));
    }

    //DELETE
    public AddressResponseDTO deleteAddress(Long id)
    {
        Address address=addressRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Nu s-a gasit adresa cu id-ul "+ id + "."));
        addressRepository.delete(address);
        return addressMapper.toDto(address);
    }


    //metoda folosita pt adresa default
    //cauta fosta adresa default, si o deselecteaza ca default
    private void unsetOldDefaultAddress(Long userId)
    {
        List<Address> userAddresses=addressRepository.findAllByUserId(userId);
        for(Address addr : userAddresses)
        {
            if(Boolean.TRUE.equals(addr.getIsDefaultDelivery()))
            {
                addr.setIsDefaultDelivery(false);
                addressRepository.save(addr); //salveaza ind b
            }
        }
    }
}
