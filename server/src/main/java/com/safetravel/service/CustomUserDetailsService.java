package com.safetravel.service;

import com.safetravel.model.Tourist;
import com.safetravel.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private TouristRepository touristRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if ("admin".equalsIgnoreCase(email)) {
            // Password is safetravel2026
            // BCrypt hash of "safetravel2026"
            return User.withUsername("admin")
                    .password("$2a$10$MscyWvLw3dY/0n3UeW2XqOfz8.8h1XFp.56.0g5mOQO.Jq7K9b9N2")
                    .roles("ADMIN")
                    .build();
        }

        Tourist tourist = touristRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Tourist not found with email: " + email));

        return new User(tourist.getEmail(), tourist.getPassword(), new ArrayList<>());
    }
}
