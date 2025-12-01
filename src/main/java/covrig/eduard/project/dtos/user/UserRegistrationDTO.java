package covrig.eduard.project.dtos.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {

    @NotBlank(message="Email-ul este obligatoriu")
    @Email(message="Formatul email-ului este invalid.")
    private String email;

    @NotBlank(message="Parola este obligatorie.")
    @Size(min=8, message="Parola trebuie sa aiba minim 8 caractere.")
    private String password;

    private String firstName;
    private String lastName;


    private String phoneNumber;
}
