package covrig.eduard.project.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {
    @Value("${application.security.jwt.secret-key}") //preia din applications.properties cheia
    //spring cauta automat in applications.properties ce am pus ca parametru
    private String secretKey;

    // 1. GENERARE TOKEN (Simplu, doar cu user details)
    //ia email-ul, adauga data de expirare si le impacheteaza intr-un sir criptat.
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails); //facem hasmap-ul gol, deci extraclaim in constructorul
        //urmator va fi gol, deci fara alte informatii.
    }

    // 2. GENERARE TOKEN (Cu extra informatii, daca punem si rolul in el)
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // Aici punem email-ul
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expira in 24 ore
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //verificare token (verifica daca a expirat si daca semnatura e corecta)
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // Token-ul e valid dacă username-ul coincide și nu a expirat
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
    //Extrage email-ul din el
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }


    //METODE DE AJUTOR PT CELELALTE METODE.

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


}

