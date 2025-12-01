package covrig.eduard.project.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
//nu le ia de sus in jos, ci le ia in ordinea cea mai specifica, deci daca am o eroare de login,
//stie sa se duca direct in handlerul de login si nu intra in aia generica de runtimeexception.
public class GlobalExceptionHandler {


    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) // Setează statusul HTTP la 404
    public String handleResourceNotFound(RuntimeException ex)
    {
        return ex.getMessage();
        //mesajul din service, transformat in json si trimis clientului (ex: "Brand not found with id: 123")
    }



    // HANDLER PENTRU EROARE 400 (Validarea DTO @Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String,String> handleValidationExceptions(
            MethodArgumentNotValidException ex)
    {
        Map<String,String> errors=new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
        {
            errors.put(error.getField(),error.getDefaultMessage());
        });
        return errors;
    }

    // HANDLER PENTRU ERORI DE SECURITATE (Login esuat, la register nu e cazul)
    // Prinde BadCredentialsException, UsernameNotFoundException, etc.
    @ExceptionHandler({AuthenticationException.class}) //toate clasele necesare
    @ResponseStatus(HttpStatus.UNAUTHORIZED) // Returneaza 401
    public Map<String, String> handleAuthenticationException(AuthenticationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Autentificare esuata");
        error.put("message", "Email sau parola incorecta"); // Mesaj generic pentru securitate, sa nu
        //divulgam informatii care pot cauza probleme in viitor.
        return error;
    }
    // 4. HANDLER PENTRU BODY LIPSA la request SAU JSON INVALID
    // Prinde eroarea "Required request body is missing"
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleMissingBody(HttpMessageNotReadableException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Bad Request");
        error.put("message", "Corpul cererii (JSON) lipseste, este invalid sau este formatat gresit.");
        return error;
    }


}