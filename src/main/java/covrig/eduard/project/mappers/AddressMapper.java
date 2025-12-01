package covrig.eduard.project.mappers;

import covrig.eduard.project.Models.Address;
import covrig.eduard.project.dtos.address.AddressCreationDTO;
import covrig.eduard.project.dtos.address.AddressResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressResponseDTO toDto(Address address);
    List<AddressResponseDTO> toDtoList(List<Address> addresses);

    @Mapping(target = "id", ignore = true)   // ID-ul e generat de DB
    @Mapping(target = "user", ignore = true) // User-ul e un Obiect, DTO-ul are doar un ID. Il setam manual în Service.
    Address toEntity(AddressCreationDTO dto);
}
