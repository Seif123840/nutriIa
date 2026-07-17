package com.example.nutri.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();

        // 🔥 On laisse passer les routes publiques d'authentification sans vérifier de token
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔥 LOG pour vérifier que le filtre est bien appelé
        System.out.println("🔥 FILTRE JWT EXÉCUTÉ pour : " + request.getMethod() + " " + request.getServletPath());

        String jwt = getJwtFromRequest(request);
        System.out.println("🔑 Token extrait : " + (jwt != null ? "oui (" + jwt.substring(0, Math.min(30, jwt.length())) + "...)" : "NON"));

        if (jwt != null) {
            try {
                boolean valid = tokenProvider.validateToken(jwt);
                System.out.println("✅ Token valide ? " + valid);

                if (valid) {
                    String username = tokenProvider.getUsernameFromJWT(jwt);
                    System.out.println("👤 Username : " + username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    System.out.println("📋 UserDetails chargé : " + userDetails.getUsername());
                    System.out.println("🔑 Rôles : " + userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    System.out.println("✅ AUTHENTIFICATION OK !");
                } else {
                    // 🔥 ON ARRÊTE ICI → 401
                    System.out.println("❌ Token invalide (validateToken false)");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid token");
                    return;
                }
            } catch (Exception e) {
                // 🔥 ON ARRÊTE ICI → 401
                System.out.println("❌ Erreur auth : " + e.getMessage());
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Authentication error: " + e.getMessage());
                return;
            }
        } else {
            System.out.println("⚠️ Aucun token trouvé");
        }

        // On continue uniquement si tout est OK
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}