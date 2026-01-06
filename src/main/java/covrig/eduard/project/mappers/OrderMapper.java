package covrig.eduard.project.mappers;

import covrig.eduard.project.Models.CartItem;
import covrig.eduard.project.Models.Order;
import covrig.eduard.project.Models.OrderItem;
import covrig.eduard.project.dtos.order.OrderItemResponseDTO;
import covrig.eduard.project.dtos.order.OrderResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel="spring")
public interface OrderMapper {
    // Order -> DTO
    OrderResponseDTO toDto(Order order);
    // List Order -> List DTO
    List<OrderResponseDTO> toDtoList(List<Order> orders);

    //OrderItem -> DTO
    @Mapping(source = "product.name", target = "productName")
    @Mapping(target = "subTotal", expression = "java(item.getPrice() * item.getQuantity())")
    OrderItemResponseDTO toItemDto(OrderItem item); //metoda care se va aplica recursiv pe lista de iteme din OrderResponseDTO


    //CartItem -> OrderItem
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(source = "product", target = "product")
    @Mapping(source = "quantity", target = "quantity")
    @Mapping(source = "product.price", target = "basePrice")
    @Mapping(target = "price", ignore = true)
    OrderItem cartItemToOrderItem(CartItem cartItem);
}
