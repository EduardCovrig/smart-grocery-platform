package covrig.eduard.project.Config;

import covrig.eduard.project.Security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Dezactivam CSRF (nu e necesar la JWT/Stateless)
                //atac csrf e imposibil cu jwt salvat local
                .authorizeHttpRequests(auth -> auth
                        // 1. Lasam libere doar rutele de autentificare (Login/Register)
                        .requestMatchers("/api/auth/**").permitAll()

                        // 2. ORICE alta cerere necesita autentificare (Token JWT valid)
                        .anyRequest().authenticated()
                )
                // 3. stateless (adica serverul nu tine minte nimic despre sesiuni, nu time minte tokenuri utilizator nimic)
                //doar ofera tokenul si mai departe e treaba userului/front-ului sa se descurce.
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                //4. providerul care verifica parola
                .authenticationProvider(authenticationProvider)

                // 5. adaugam filtrul de JWT inainte de filtrele standard Spring(care sunt vreo 12-15), si abia apoi ajunge
                //efectiv la DispatcherServlet, care va trimite o cerere catre controller in final.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
                    //UsernamePasswordAuthenticationFilter.class e un filtru standard Spring Security,
                    //adaugam nevoia de jwt fix inainte de introducere username si parola, astfel incat daca utilizatorul
                    //are un JWT valid, sa nu mai fie nevoei sa introduca username si parola.

        return http.build();
    }
}